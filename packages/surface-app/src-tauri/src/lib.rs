mod commands;

use commands::{keychain, launch, oauth, projects};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    App, Manager, Runtime,
};

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            setup_tray(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            oauth::start_device_flow,
            oauth::poll_device_flow,
            keychain::get_token,
            keychain::store_token,
            keychain::clear_token,
            projects::get_recent_projects,
            projects::add_recent_project,
            projects::remove_recent_project,
            launch::launch_project,
            launch::stop_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_tray<R: Runtime>(app: &App<R>) -> tauri::Result<()> {
    let switch = MenuItem::with_id(app, "switch", "Switch Project", true, None::<&str>)?;
    let separator = tauri::menu::PredefinedMenuItem::separator(app)?;
    let quit = MenuItem::with_id(app, "quit", "Quit DesignTools", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&switch, &separator, &quit])?;

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "switch" => {
                launch::kill_running();
                if let Some(win) = app.get_webview_window("main") {
                    // Navigate back to the launcher SPA
                    let launcher_url = if cfg!(debug_assertions) {
                        "http://localhost:1420"
                    } else {
                        "tauri://localhost"
                    };
                    let _ = win.navigate(launcher_url.parse::<tauri::Url>().unwrap());
                    let _ = win.set_size(tauri::Size::Physical(tauri::PhysicalSize {
                        width: 780,
                        height: 560,
                    }));
                    let _ = win.show();
                    let _ = win.set_focus();
                }
            }
            "quit" => {
                launch::kill_running();
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { .. } = event {
                if let Some(win) = tray.app_handle().get_webview_window("main") {
                    let _ = win.show();
                    let _ = win.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}
