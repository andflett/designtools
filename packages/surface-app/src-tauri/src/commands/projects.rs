use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RecentProject {
    pub name: String,
    pub owner: String,
    pub url: String,
    pub project_root: String,
    pub last_opened: String,
}

fn projects_path() -> PathBuf {
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".designtools")
        .join("projects.json")
}

fn load() -> Vec<RecentProject> {
    let path = projects_path();
    if !path.exists() {
        return vec![];
    }
    serde_json::from_str(&fs::read_to_string(&path).unwrap_or_default()).unwrap_or_default()
}

fn save(projects: &[RecentProject]) {
    let path = projects_path();
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    if let Ok(json) = serde_json::to_string_pretty(projects) {
        let _ = fs::write(&path, json);
    }
}

#[tauri::command]
pub fn get_recent_projects() -> Vec<RecentProject> {
    let mut list = load();
    list.sort_by(|a, b| b.last_opened.cmp(&a.last_opened));
    list
}

#[tauri::command]
pub fn add_recent_project(project: RecentProject) -> Result<(), String> {
    let mut list = load();
    list.retain(|p| p.url != project.url);
    list.insert(0, project);
    list.truncate(20);
    save(&list);
    Ok(())
}

#[tauri::command]
pub fn remove_recent_project(url: String) -> Result<(), String> {
    let mut list = load();
    list.retain(|p| p.url != url);
    save(&list);
    Ok(())
}
