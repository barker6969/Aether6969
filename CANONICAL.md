# Canonical repository

**This repo (`barker6969/Aether6969`) is the single source of truth.**

## Why consolidate

Several repos held overlapping copies of the same product:

| Repo | Role |
|------|------|
| [Aether6969](https://github.com/barker6969/Aether6969) | **Canonical** — develop here |
| [aether](https://github.com/barker6969/aether) | Older tree + Electron-era build docs |
| [aether-phones](https://github.com/barker6969/aether-phones) | Vercel-linked copy; backend requirements tweak |
| [Aether69](https://github.com/barker6969/Aether69) | Private mirror |
| [aether.exe](https://github.com/barker6969/aether.exe) | Private early desktop experiment |

## Best pieces kept in Aether6969

| Feature | Origin |
|---------|--------|
| Tauri 2 desktop + cross-platform Actions | Aether6969 |
| Live GitHub Release assets (MSI/DMG/AppImage) | Aether6969 |
| `aether-cli apple-detect` (DFU/Recovery USB only) | Aether6969 |
| Frontend download wiring → `desktop-v*` assets | Aether6969 |
| `download/` static page + Pages workflow | Aether6969 |
| Docker compose + FastAPI backend (no private PyPI dep) | Aether6969 + aether-phones fix |
| Clear README / deploy mental model | adapted from `aether` docs |

## What was intentionally *not* merged

- **Electron** build scripts (`BUILD-APP.bat`, `electron-build`, old `release.yml`) — superseded by Tauri + `desktop-release.yml`
- Passcode-bypass / unofficial Apple unlock tooling — out of scope; official restore only

## Archive mirrors (automated)

Targets: `aether`, `aether-phones`, `Aether69`, `aether.exe` — **never** Aether6969.

### Option A — GitHub Actions (recommended)

1. Create a PAT with **Administration: Read and write** on those four repos  
   (or classic PAT with `repo` scope for private + public).
2. **Aether6969 → Settings → Secrets and variables → Actions**  
   → New secret: `ARCHIVE_PAT` = your token.
3. **Actions → “Archive mirror repositories” → Run workflow**  
   → type `ARCHIVE` in the confirm field → Run.

Workflow file: `.github/workflows/archive-mirrors.yml`

### Option B — Local script

```bash
gh auth login   # once
chmod +x scripts/archive-mirrors.sh
./scripts/archive-mirrors.sh
```

Or without `gh`:

```bash
GITHUB_TOKEN=ghp_xxx ./scripts/archive-mirrors.sh
```
