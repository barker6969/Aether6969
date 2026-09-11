# Aether Desktop

Native Windows / macOS / Linux app for the Aether Repair Tool (Tauri 2).

**The MSI ships with `aether-cli`.** On launch the app starts the USB bridge
(`aether-cli serve` → `ws://127.0.0.1:8765`) so the dashboard can use live USB
without a separate CLI install.

---

## How CLI ↔ MSI association works

1. **Build** — `scripts/prepare-cli-sidecar.js` compiles `../aether-cli` and
   copies the binary to `src-tauri/binaries/aether-cli-<target-triple>`.
2. **Bundle** — `tauri.conf.json` → `bundle.externalBin` includes that binary
   inside the MSI / DMG / AppImage next to the main executable.
3. **Runtime** — `lib.rs` resolves `aether-cli` next to the app, runs
   `serve`, and stops it when the window exits.

```
Install MSI → Start Menu "Aether Repair Tool"
    → launches desktop shell
    → auto-starts bundled aether-cli serve
    → loads dashboard (WebView)
    → dashboard connects to ws://127.0.0.1:8765
```

---

## Prerequisites

1. **Rust** — [rustup.rs](https://rustup.rs)
2. **Node 18+**
3. Platform C++ / WebView deps (see Tauri docs)

---

## Build

```bash
cd aether-desktop
yarn install

# Builds CLI sidecar, then installer:
yarn build:msi        # Windows .msi  (includes aether-cli.exe)
yarn build:nsis
yarn build:dmg
yarn build:appimage
yarn build            # all targets for this host
```

Outputs (typical):

* Windows: `src-tauri/target/release/bundle/msi/*Aether*Repair*Tool*.msi`
* macOS:   `src-tauri/target/release/bundle/dmg/*.dmg`
* Linux:   `src-tauri/target/release/bundle/appimage/*.AppImage`

---

## Dev

```bash
cd aether-desktop
yarn dev
# prepares CLI, then tauri dev
```

If the CLI was built once (`cd ../aether-cli && cargo build --release`), the
dev app will also find it under `aether-cli/target/release/`.

---

## Verify association after install

1. Install the MSI.
2. Launch **Aether Repair Tool** from the Start menu.
3. Dashboard should see CLI bridge live (or enable bridge once).
4. Task Manager: `aether-cli.exe` should be running while the app is open.
5. Closing the app stops the bridge process.

---

## CI

Tag `desktop-v*` or run workflow **Release aether-desktop**.
The workflow builds the CLI sidecar before `tauri-action` packs the MSI.

---

## Future: in-process IPC

Optional next step: depend on `aether-cli` as a Rust crate and expose
`#[tauri::command]` APIs instead of a side process. The externalBin bridge is
the seamless path for current MSI users.
