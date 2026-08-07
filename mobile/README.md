# Aether Repair — Mobile

Expo (React Native) **companion app** wired to the same **aether-cli WebSocket bridge** as the web dashboard.

## Wire-up (live jobs)

1. On the **PC** (same Wi‑Fi as the phone):

```bash
cd aether-cli
cargo run --release -- serve --addr 0.0.0.0:8765
```

`0.0.0.0` is required so the phone can reach the bridge (not only localhost).

2. Find the PC LAN IP (e.g. `192.168.1.20`).

3. In the app: **Settings**
   - Host = PC IP  
   - Port = `8765`  
   - Enable bridge **ON**  
   - **Save & Connect**

4. Status should show **CONNECTED** and CLI version from `hello`.

5. **Probe USB devices** lists `devices` from the CLI.  
   Service / Aegis actions with a mapping call live jobs:

| Action key | RPC method |
|------------|------------|
| `bypass_frp` (Aegis) | `mtk.frp_bypass` |
| `repair_imei` | `mtk.repair_imei` |
| `unlock_bootloader` | `mtk.unlock_bootloader` |
| `erase_userdata` | `mtk.erase_userdata` |
| `enter_edl` | `qualcomm.enter_edl` |
| `samsung_detect` | `samsung.detect` |
| `samsung_read_pit` | `samsung.read_pit` |
| `samsung_factory_reset` | `samsung.factory_reset` |

Console streams stdout/stderr the same way as the web UI.

**Note:** The phone does not attach USB itself. The **PC** must have the target phone in BROM/EDL/Download Mode; mobile only remote-controls the CLI.

## Run the app

```bash
cd mobile
npm install
npm start
```

## Structure

```
mobile/
  App.tsx
  src/context/CliBridgeContext.tsx   # WebSocket JSON-RPC client
  src/context/AppState.tsx           # logs + runAction → bridge
  src/lib/bridgeMethods.ts           # action → method map
  src/screens/...
```

Canonical repo: **https://github.com/barker6969/Aether6969**
