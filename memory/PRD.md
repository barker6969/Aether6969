# Aether Repair Tool — PRD

## Original Problem Statement
Desktop-style dashboard for a mobile-repair suite named "Aether Repair Tool". UI must look like a professional Windows utility (dark mode, cyber green/teal accents, high-tech) similar to Chimera Tools. Features: Sidebar, Dashboard (device status, cloud exploit DB), MTK / Qualcomm / iPhone service tabs with action buttons, scrolling console, device info. Requires Auth (JWT + Emergent Google), Stripe credits, Aether Academy documentation, native desktop executable packaging (Tauri).

## Architecture
- `/app/backend` — FastAPI, MongoDB, JWT + Emergent Google Auth, Stripe webhooks (all routes `/api`-prefixed).
- `/app/frontend` — React + Tailwind + Shadcn UI (uses `REACT_APP_BACKEND_URL`).
- `/app/aether-cli` — LOCAL-ONLY Rust WebSocket JSON-RPC bridge (port 8765) for real hardware exploits.
- `/app/aether-desktop` — LOCAL-ONLY Tauri wrapper packaging the web app as a native desktop executable.

## Implemented
- Dashboard, MTK / Qualcomm / iPhone / Samsung service pages with action grid + streaming console
- Auth (JWT email/password + Emergent Google OAuth)
- Stripe credits/licenses integration
- Aether Academy docs (in-app)
- Setup Wizard, IMEI Repair Modal, WebUSB integration
- Cable-free EDL mode wrapper in Rust CLI
- Drivers Center with expanded driver catalog
- Device signature catalog (18+ devices)
- Cloud Exploit DB view with live-feed simulation
- Tauri desktop packaging skeleton

## Deployment
- ✅ Deployment health check PASSED (Feb 2026)
- Fixed: `.gitignore` was blocking `.env` files (removed lines)
- Fixed: `AppContext.jsx` boot `useEffect` cleanup regression (P0)

## Code Quality Sweep — Feb 2026
Applied review-driven refactors, all lint-clean, 100% frontend regression pass (iteration_11):
- `DeviceStatus.jsx`: HEADER_STATES lookup + 6 single-purpose sub-components (replaces nested ternaries)
- `ActionGrid.jsx`: extracted `ActionButton` component (removed 20-line inline map)
- `BuyCreditsModal.jsx`: extracted `PlanCard` + `PackCard`
- `CloudExploitDB.jsx`: extracted `CVEEntry` + `useMemo` on visible/counts
- `ProtectedRoute.jsx`: `useMemo` for redirect state
- `useCliBridge.js`: removed `no-async-promise-executor` anti-pattern in `runJob`
- `GetDesktopHeroCard.jsx`, `DemoModeBanner.jsx`, `SetupWizard.jsx`: proper error logging replacing empty catch blocks
- Skipped: Python `is None` "fixes" (report was wrong — `is None` is the PEP-8 idiom)

## Known Non-Blocking Observations
- Auto-connect delay after fresh login (~15s) — recurring since iteration 8; users can click Start Scan manually. Fix: gate boot `useEffect` on `AuthContext.loading === false`. Deferred.

## Backlog (P1)
- Gate boot useEffect on AuthContext resolution to make auto-connect fire post-login
- Apple DFU (checkra1n / pongoOS) for legacy iPhones
- Braiden AI Companion (Claude Sonnet 4.5 floating chat overlay)

## Backlog (P2)
- Port real exploit code to pure Rust (replace Python mtkclient / C++ heimdall wrappers)

## Test Credentials
See `/app/memory/test_credentials.md`.
