// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;
use tauri_plugin_autostart::MacosLauncher;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
fn dlp(link: String) -> String {
    let pure_link = Command::new(".\\yt-dlp.exe")
        .args(&["-g", "-f", "140", &link])
        .output()
        .expect("failed");

    if pure_link.status.success() {
        let result = String::from_utf8_lossy(&pure_link.stdout);
        result.into()
    } else {
        "Error".into()
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![dlp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(MacosLauncher::LaunchAgent, Some(vec!["--flag1", "--flag2"]) /* arbitrary number of args to pass to your app */))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
