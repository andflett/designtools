use serde::Serialize;
use std::io::{BufRead, BufReader};
use std::process::{Child, Command, Stdio};
use std::sync::{Mutex, OnceLock};
use tauri::{AppHandle, Emitter, Manager};

static SURFACE: OnceLock<Mutex<Option<Child>>> = OnceLock::new();

fn surface_lock() -> &'static Mutex<Option<Child>> {
    SURFACE.get_or_init(|| Mutex::new(None))
}

pub fn kill_running() {
    if let Ok(mut guard) = surface_lock().lock() {
        if let Some(mut child) = guard.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }
}

#[derive(Serialize, Clone)]
pub struct LaunchProgress {
    pub phase: String,
    pub message: String,
}

/// Resolves the surface binary. Tries `surface` on PATH first, then falls
/// back to `npx --yes @designtools/surface` which works without a global install.
fn surface_argv(extra: &[&str]) -> (String, Vec<String>) {
    let found_in_path = Command::new("surface")
        .arg("--help")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map(|s| s.success())
        .unwrap_or(false);

    if found_in_path {
        let args = std::iter::once("open")
            .chain(extra.iter().copied())
            .chain(["--no-open"])
            .map(String::from)
            .collect();
        ("surface".into(), args)
    } else {
        let mut args = vec![
            "--yes".into(),
            "@designtools/surface".into(),
            "open".into(),
        ];
        for a in extra {
            args.push((*a).into());
        }
        args.push("--no-open".into());
        ("npx".into(), args)
    }
}

#[tauri::command]
pub async fn launch_project(
    app: AppHandle,
    repo_url: String,
    staging_url: Option<String>,
) -> Result<(), String> {
    kill_running();

    let mut extra: Vec<String> = vec![repo_url.clone()];
    if let Some(ref url) = staging_url {
        extra.push("--url".into());
        extra.push(url.clone());
    }

    let extra_refs: Vec<&str> = extra.iter().map(String::as_str).collect();
    let (cmd, args) = surface_argv(&extra_refs);

    let mut child = Command::new(&cmd)
        .args(&args)
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("Failed to start surface: {e}. Is Node.js installed?"))?;

    let stdout = child.stdout.take().unwrap();

    *surface_lock().lock().unwrap() = Some(child);

    // Watch stdout on a background thread and emit Tauri events per line
    let app_handle = app.clone();
    std::thread::spawn(move || {
        let reader = BufReader::new(stdout);
        for line in reader.lines() {
            let Ok(line) = line else { break };
            if let Some(progress) = parse_line(&line) {
                let is_ready = progress.phase == "ready";
                let _ = app_handle.emit("launch-progress", progress);
                if is_ready {
                    // Resize window to a comfortable editor size, then navigate
                    if let Some(win) = app_handle.get_webview_window("main") {
                        let _ = win.set_size(tauri::Size::Physical(tauri::PhysicalSize {
                            width: 1400,
                            height: 900,
                        }));
                        let _ = win.navigate(
                            "http://localhost:4400"
                                .parse::<tauri::Url>()
                                .expect("static URL"),
                        );
                    }
                    break;
                }
            }
        }
    });

    Ok(())
}

#[tauri::command]
pub fn stop_project() -> Result<(), String> {
    kill_running();
    Ok(())
}

/// Strip ANSI escape codes from a line.
fn strip_ansi(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    let mut chars = s.chars().peekable();
    while let Some(c) = chars.next() {
        if c == '\x1b' {
            // Skip until the terminating letter of the escape sequence
            for c2 in chars.by_ref() {
                if c2.is_ascii_alphabetic() {
                    break;
                }
            }
        } else {
            out.push(c);
        }
    }
    out
}

/// Map a surface CLI stdout line to a progress event, or None if it's noise.
fn parse_line(raw: &str) -> Option<LaunchProgress> {
    let line = strip_ansi(raw);
    let line = line.trim();
    if line.is_empty() {
        return None;
    }

    // Strip leading bullet/arrow/check symbols and whitespace
    let msg = line
        .trim_start_matches(['·', '→', '✓', '✗', '⚠', ' '])
        .trim()
        .to_string();

    if line.contains("Cloning") || line.contains("clone") {
        return Some(p("clone", &msg));
    }
    if line.contains("Installing") || line.contains("npm install") || line.contains("pnpm install") {
        return Some(p("install", &msg));
    }
    if line.contains("Starting") && line.contains("server") {
        return Some(p("start", &msg));
    }
    if line.contains("Waiting") {
        return Some(p("wait", &msg));
    }
    // "✓ Target   http://localhost:3000" — dev server confirmed up
    if line.contains("Target") && line.contains("localhost") {
        return Some(p("start", &msg));
    }
    // "✓ Tool     http://localhost:4400" — surface editor is ready
    if line.contains("Tool") && line.contains(":4400") {
        return Some(p("ready", "Surface editor ready"));
    }
    // Error lines
    if line.starts_with('✗') || line.contains("Could not") || line.contains("ENOENT") {
        return Some(p("error", &msg));
    }

    None
}

fn p(phase: &str, message: &str) -> LaunchProgress {
    LaunchProgress {
        phase: phase.into(),
        message: message.into(),
    }
}
