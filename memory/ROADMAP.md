# Aether — Roadmap

## P0 — Active
*(empty — Samsung demo path fixed & verified, Setup Wizard shipped & verified, desktop CI green, web app 100%)*

## P1 — Next up
- **Ship aether-cli v0.2.0** — includes the new `setup.doctor` + `setup.install_mtkclient` bridge methods (Setup Wizard live-mode features need them). Tag `v0.2.0` → CI publishes 4 artifacts.
- **Publish the desktop draft Release** on GitHub (`braidenbarker/aether`) → flips all in-app download buttons live.
- **Re-tag `desktop-v0.1.0`** so the rewritten workflow runs cleanly (delete old tag → push new tag).
- **IMEI Repair modal** — form for inputting IMEI1/IMEI2 with strong legal disclaimer checkbox, then wires into `BRIDGE_METHODS.repair_imei` (currently intentionally omitted pending this modal).
- **Code-signing**: add Windows Authenticode + macOS Developer ID secrets so installers don't show SmartScreen / Gatekeeper warnings.
- **Graceful USB-less fallback for `rusb`** — no panic on Docker/headless → ship as part of aether-cli v0.2.0.

## P2 — Backlog
- Real Samsung FRP via Heimdall — add a `samsung.frp_bypass` CLI method (Samsung "Bypass FRP" button currently reuses the mtk `bypass_frp` demo template; misleading in live mode).
- Persist credits + log history to MongoDB (currently client-side only).
- Port real Qualcomm exploits — wrap `edl.py` (https://github.com/bkerler/edl) the same way mtkclient is wrapped. ~3 days.
- Wire `DownloadCliButton`/`DownloadDesktopButton` to tag-specific URLs so desktop + CLI releases can coexist.
- "Sign in on Desktop" deep-link flow — first-launch auto-auth.
- Add root `data-testid`s to remaining dashboard panels for easier automation.
- Theme toggle (light mode), multi-language, additional chipset DB.

## P3 — Future
- Braiden AI Companion HUD (Claude Sonnet 4.5 via Emergent LLM Key) — context-aware floating chat reading active operation + console logs.
- Auto-update channel for the Tauri app (built-in support, needs signing keys wired).
- Apple DFU support — wrap `checkra1n` / `pongoOS` for legacy iPhone models.
- Port real exploit code to pure Rust (replace Python mtkclient / C++ heimdall subprocess wrappers) — long-term.
