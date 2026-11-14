# Integration with Aether6969

| Component | Path | Role |
|-----------|------|------|
| MapleRoot APK | `../mapleroot/` | On-device chain |
| MapleHost | this folder | PC build/deploy/reports |
| Aether CLI | `Aether6969/aether-cli` | USB host tools |
| Aether Desktop | `Aether6969/aether-desktop` | Tauri UI |
| Mobile companion | `Aether6969/mobile` | Expo catalog / docs |

MapleHost drives MapleRoot builds. Aether handles USB unlock / FRP / Apple DFU detection.
Apple path: detection + official restore only.
