# Aether Repair Tool

**Canonical monorepo** for the Aether phone-repair platform — desktop app, CLI, web dashboard, mobile companion, and API.

> Other repos (`aether`, `aether-phones`, `Aether69`, `aether.exe`) are historical / mirrors. **Develop and release from this repo only.**

---

## Start in 30 seconds

### End users — install desktop

| Platform | Link |
|----------|------|
| **Windows MSI** | [Download](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_x64_en-US.msi) |
| **macOS DMG** | [Download](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_universal.dmg) |
| **Linux AppImage** | [Download](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_amd64.AppImage) |

### Developers — one command

```powershell
# Windows
git clone https://github.com/barker6969/Aether6969.git
cd Aether6969
.\start.ps1
```

```bash
# macOS / Linux
git clone https://github.com/barker6969/Aether6969.git
cd Aether6969
chmod +x start.sh && ./start.sh
```

→ **http://localhost:3000** (guest mode, no login)

USB bridge in the same go:

```powershell
.\start.ps1 -Bridge
```

```bash
./start.sh --bridge
```

Full local notes: **[LOCAL-LAUNCH.md](./LOCAL-LAUNCH.md)**

---

## What’s included

| Component | Path | Status |
|-----------|------|--------|
| **Desktop app** (Tauri 2) | `aether-desktop/` | MSI / DMG / AppImage via GitHub Actions |
| **Local CLI** (USB bridge) | `aether-cli/` | Real USB scan · Apple DFU detect · Samsung/MTK stubs |
| **Web dashboard** | `frontend/` | React UI · download buttons → GitHub Releases |
| **Mobile companion** | `mobile/` | Expo (React Native) · catalog, Aegis, docs |
| **API backend** | `backend/` | FastAPI · auth · Mongo |
| **Public download page** | `download/` | Static page for installers |
| **Marketing** | `marketing/` | Landing / copy assets |
| **CI releases** | `.github/workflows/` | `desktop-release.yml`, CLI release, Pages |

---

## Develop (manual)

```bash
# Frontend only
cd frontend && cp .env.example .env && npm install && npm start

# Mobile companion (Expo)
cd mobile && npm install && npm start

# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8001

# CLI (USB)
cd aether-cli && cargo build --release
./target/release/aether-cli devices
./target/release/aether-cli apple-detect
./target/release/aether-cli serve          # ws://127.0.0.1:8765

# Docker (API + frontend)
docker compose up --pull always
```

### Publish a new desktop build

```text
Actions → “Aether Desktop · Cross-platform release” → Run workflow
```

---

## CLI highlights

| Command | What it does |
|---------|----------------|
| `devices` | List USB devices; highlight BROM / EDL / DFU / Download |
| `scan` | Hot-plug watch |
| `apple-detect` | Apple DFU / Recovery detection only — restore via Finder / Apple Devices |
| `samsung-detect` | Samsung Download Mode (Heimdall) |
| `serve` | Local WebSocket bridge for the React dashboard |

Apple path is **detection + official erase/restore only**. No passcode bypass.

---

## Structure

```text
Aether6969/
├── start.ps1           # Windows one-command start
├── start.sh            # macOS/Linux one-command start
├── LOCAL-LAUNCH.md     # Full local guide
├── aether-desktop/     # Tauri 2 wrapper
├── aether-cli/         # Rust USB + bridge
├── frontend/           # React dashboard
├── mobile/             # Expo companion app
├── backend/            # FastAPI
├── download/           # Static installer landing page
├── marketing/
├── .github/workflows/
├── docker-compose.yml
├── SIGNING.md
└── CANONICAL.md
```

---

## Legal

For authorized technicians and devices you own or are licensed to service. See `aether-cli/NOTICE.md` and product terms.

---

**Aether Labs** · desktop-v0.1.0
