# Aether Repair Tool

**Canonical monorepo** for the Aether phone-repair platform — desktop app, CLI, web dashboard, and API.

> Other repos (`aether`, `aether-phones`, `Aether69`, `aether.exe`) are historical / mirrors. **Develop and release from this repo only.**

---

## What’s included

| Component | Path | Status |
|-----------|------|--------|
| **Desktop app** (Tauri 2) | `aether-desktop/` | MSI / DMG / AppImage via GitHub Actions |
| **Local CLI** (USB bridge) | `aether-cli/` | Real USB scan · Apple DFU detect · Samsung/MTK stubs |
| **Web dashboard** | `frontend/` | React UI · download buttons → GitHub Releases |
| **API backend** | `backend/` | FastAPI · auth · Mongo |
| **Public download page** | `download/` | Static page for installers |
| **Marketing** | `marketing/` | Landing / copy assets |
| **CI releases** | `.github/workflows/` | `desktop-release.yml`, CLI release, Pages |

---

## Quick start

### Download desktop (end users)

| Platform | Link |
|----------|------|
| **Windows MSI** | [Aether.Repair.Tool_0.1.0_x64_en-US.msi](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_x64_en-US.msi) |
| **macOS DMG** | [Aether.Repair.Tool_0.1.0_universal.dmg](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_universal.dmg) |
| **Linux AppImage** | [Aether.Repair.Tool_0.1.0_amd64.AppImage](https://github.com/barker6969/Aether6969/releases/download/desktop-v0.1.0/Aether.Repair.Tool_0.1.0_amd64.AppImage) |

Release page: https://github.com/barker6969/Aether6969/releases/tag/desktop-v0.1.0

### Develop

```bash
# Frontend
cd frontend && npm install && npm start

# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8001

# CLI (USB)
cd aether-cli && cargo build --release
./target/release/aether-cli devices
./target/release/aether-cli apple-detect   # iPhone DFU / Recovery USB only
./target/release/aether-cli serve          # ws://127.0.0.1:8765 for dashboard

# Docker (API + frontend stack)
docker compose up --pull always
```

### Publish a new desktop build

```text
Actions → “Aether Desktop · Cross-platform release” → Run workflow
```

Or tag and use the workflow inputs for `desktop-vX.Y.Z`.

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

## Repo map (why this one)

| Former repo | What we kept here |
|-------------|-------------------|
| **Aether6969** | Tauri desktop CI, live MSI/DMG/AppImage, `apple-detect`, download page, marketing |
| **aether** | Dev/Docker docs pattern, deploy checklists (adapted; Electron builds superseded by Tauri) |
| **aether-phones** | Backend deps cleaned for Vercel (no private PyPI package) |
| **Aether69 / aether.exe** | Older mirrors — do not develop there |

See [CANONICAL.md](./CANONICAL.md) for the full consolidation note.

---

## Structure

```text
Aether6969/
├── aether-desktop/     # Tauri 2 wrapper
├── aether-cli/         # Rust USB + bridge
├── frontend/           # React dashboard
├── backend/            # FastAPI
├── download/           # Static installer landing page
├── marketing/
├── .github/workflows/  # desktop-release, cli-release, pages
├── docker-compose.yml
├── SIGNING.md
└── CANONICAL.md
```

---

## Legal

For authorized technicians and devices you own or are licensed to service. See `aether-cli/NOTICE.md` and product terms.

---

**Aether Labs** · desktop-v0.1.0
