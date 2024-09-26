use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            #[cfg(desktop)]
            let _ = app
                .handle()
                .plugin(tauri_plugin_updater::Builder::new().build());

            // use tauri_plugin_autostart::MacosLauncher;
            use tauri_plugin_autostart::ManagerExt;

            #[cfg(desktop)]
            let _ = app.handle().plugin(tauri_plugin_autostart::init(
                tauri_plugin_autostart::MacosLauncher::LaunchAgent,
                Some(vec!["--flag1", "--flag2"]), /* arbitrary number of args to pass to your app */
            ));
            // Get the autostart manager
            let autostart_manager = app.autolaunch();
            // Enable autostart
            let _ = autostart_manager.enable();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![dlp])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
