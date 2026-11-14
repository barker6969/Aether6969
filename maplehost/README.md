# MapleHost (computer software)

PC companion for **MapleRoot**. Runs on Windows, macOS, and Linux.

Expects the Android tree as a **sibling folder**:

```text
Aether6969/
  mapleroot/     ← Android APK project
  maplehost/     ← this folder
```

Or set `MAPLEROOT_DIR` to the Android project path.

## Install

```bash
cd maplehost
python3 -m pip install -e .
maplehost doctor
maplehost status
```

## Commands

| Command | Purpose |
|---------|---------|
| `maplehost doctor` | Check adb, clang, SDK/NDK |
| `maplehost status` | Payloads / module in mapleroot |
| `maplehost devices` | adb device list |
| `maplehost build-payloads <kmi> [kdir]` | Build native payloads (+ optional .ko) |
| `maplehost offsets <boot.img>` | Generate `mapleroot/lkm/offsets.h` |
| `maplehost apk` | Assemble debug/release APK |
| `maplehost install --launch` | adb install + start |
| `maplehost pull-report` | Pull device logs |
| `maplehost ingest <json>` | Update known_good table |

GPL-2.0 — see LICENSE / NOTICE.
