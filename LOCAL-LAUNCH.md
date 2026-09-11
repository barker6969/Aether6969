# Aether — start in 30 seconds

Canonical repo: **[Aether6969](https://github.com/barker6969/Aether6969)**

---

## Easiest path (end user)

Install the desktop app — no terminal:

| Platform | Download |
|----------|----------|
| **Windows** | [MSI](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_x64_en-US.msi) |
| **macOS** | [DMG](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_universal.dmg) |
| **Linux** | [AppImage](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_amd64.AppImage) |

All releases: https://github.com/barker6969/Aether6969/releases

---

## One-command local dashboard (developers)

### Windows (PowerShell)

```powershell
git clone https://github.com/barker6969/Aether6969.git
cd Aether6969
.\start.ps1
```

With USB bridge (needs Rust once, or a prebuilt CLI):

```powershell
.\start.ps1 -Bridge
```

### macOS / Linux

```bash
git clone https://github.com/barker6969/Aether6969.git
cd Aether6969
chmod +x start.sh
./start.sh
```

```bash
./start.sh --bridge
```

Opens **http://localhost:3000** in guest mode (no login).

---

## What the start script does

1. Checks Node is installed  
2. Creates `frontend/.env` with `REACT_APP_NO_AUTH=true` if missing  
3. Installs frontend deps (`yarn` or `npm`)  
4. Starts the React dashboard  
5. With `-Bridge` / `--bridge`: builds/runs `aether-cli serve` → `ws://127.0.0.1:8765`

---

## Manual steps (if you prefer)

```bash
cd frontend
cp .env.example .env    # already has REACT_APP_NO_AUTH=true
npm install --legacy-peer-deps   # or yarn install
npm start
```

Optional API + full stack: use `./run.sh` (needs Mongo + backend `.env`).

Optional USB only:

```bash
cd aether-cli
cargo build --release
./target/release/aether-cli serve
```

In the browser (if bridge doesn’t auto-connect):

```js
localStorage.setItem("aether.bridge.enabled", "1");
localStorage.setItem("aether.bridge", "ws://127.0.0.1:8765");
location.reload();
```

---

## Requirements

| Need | For |
|------|-----|
| **Node 18+** (20 LTS best) | Dashboard |
| **Rust / cargo** (optional) | Build CLI from source |
| **Prebuilt CLI ZIP** | USB without compiling |

CLI ZIPs: https://github.com/barker6969/Aether6969/releases/latest

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Login / session spinner | Ensure `REACT_APP_NO_AUTH=true` in `frontend/.env`, restart `npm start` |
| `ajv` / build errors | `npm install ajv@8.17.1 --save-exact --legacy-peer-deps` |
| Bridge offline | Run `aether-cli serve` or `start.ps1 -Bridge` |
| Port 3000 in use | Close other apps or set `PORT=3001` before start |

---

**Aether Labs** · local launch
