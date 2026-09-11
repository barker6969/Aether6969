// Aether Desktop — Tauri v2 library entry.
//
// Spawns the bundled `aether-cli serve` sidecar on launch so the dashboard
// can talk USB over ws://127.0.0.1:8765 without a separate install step.
// The CLI binary is shipped inside the MSI / DMG / AppImage via externalBin.

use serde::Serialize;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use tauri::{Manager, RunEvent};

struct BridgeChild(Mutex<Option<Child>>);

#[derive(Serialize)]
struct AppInfo {
    name: &'static str,
    version: &'static str,
    platform: &'static str,
    bridge: bool,
}

/// Returns basic app metadata (+ whether the local CLI bridge was started).
#[tauri::command]
fn app_info(state: tauri::State<'_, BridgeChild>) -> AppInfo {
    let bridge = state
        .0
        .lock()
        .map(|g| g.is_some())
        .unwrap_or(false);
    AppInfo {
        name: "aether-desktop",
        version: env!("CARGO_PKG_VERSION"),
        platform: std::env::consts::OS,
        bridge,
    }
}

/// Resolve path to bundled aether-cli next to the desktop executable
/// (Tauri externalBin places it there inside MSI/NSIS/DMG/AppImage).
fn resolve_cli_binary() -> Option<std::path::PathBuf> {
    let mut dir = std::env::current_exe().ok()?;
    dir.pop();

    #[cfg(windows)]
    let names = ["aether-cli.exe", "aether-cli"];
    #[cfg(not(windows))]
    let names = ["aether-cli"];

    for name in names {
        let candidate = dir.join(name);
        if candidate.is_file() {
            return Some(candidate);
        }
    }

    // Dev: repo layout aether-desktop/src-tauri/target/... → ../../../aether-cli/target/release
    if let Ok(cwd) = std::env::current_dir() {
        #[cfg(windows)]
        let dev = cwd
            .join("../../aether-cli/target/release/aether-cli.exe");
        #[cfg(not(windows))]
        let dev = cwd.join("../../aether-cli/target/release/aether-cli");
        if dev.is_file() {
            return Some(dev);
        }
        #[cfg(windows)]
        let dev2 = cwd
            .join("../../../aether-cli/target/release/aether-cli.exe");
        #[cfg(not(windows))]
        let dev2 = cwd.join("../../../aether-cli/target/release/aether-cli");
        if dev2.is_file() {
            return Some(dev2);
        }
    }

    None
}

fn spawn_cli_bridge() -> Option<Child> {
    let bin = match resolve_cli_binary() {
        Some(p) => p,
        None => {
            eprintln!("[aether-desktop] aether-cli not found next to app — USB bridge offline");
            return None;
        }
    };

    match Command::new(&bin)
        .arg("serve")
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .stdin(Stdio::null())
        .spawn()
    {
        Ok(child) => {
            eprintln!("[aether-desktop] USB bridge started: {} serve", bin.display());
            Some(child)
        }
        Err(e) => {
            eprintln!("[aether-desktop] failed to start CLI bridge: {e}");
            None
        }
    }
}

fn stop_cli_bridge(state: &BridgeChild) {
    if let Ok(mut guard) = state.0.lock() {
        if let Some(mut child) = guard.take() {
            let _ = child.kill();
            let _ = child.wait();
            eprintln!("[aether-desktop] USB bridge stopped");
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(BridgeChild(Mutex::new(None)))
        .setup(|app| {
            let child = spawn_cli_bridge();
            if let Ok(mut guard) = app.state::<BridgeChild>().0.lock() {
                *guard = child;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![app_info])
        .build(tauri::generate_context!())
        .expect("error while building Aether Desktop")
        .run(|app_handle, event| {
            if matches!(event, RunEvent::Exit | RunEvent::ExitRequested { .. }) {
                let state = app_handle.state::<BridgeChild>();
                stop_cli_bridge(&state);
            }
        });
}
