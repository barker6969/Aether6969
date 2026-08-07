# Aether Repair — Mobile

Expo (React Native) **companion app** for technicians. Reuses the Aether product model from the web/desktop suite:

- Service modules: **MTK · Qualcomm · Samsung · iPhone**
- **Aegis Unlock** hub (Android post-reset guard — not iPhone passcode unlock)
- Session console, docs, credits wallet, desktop download links

## Important limit

**Live USB repair does not run on the phone.** BROM / EDL / Download Mode / DFU need the [desktop build](https://github.com/barker6969/Aether6969/releases/tag/desktop-v0.1.0) and `aether-cli` on a workstation. Mobile is for catalog, docs, logs notes, and launching desktop installs.

## Run

```bash
cd mobile
npm install
npm start
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR with Expo Go.

## Structure

```
mobile/
  App.tsx                 # tabs + stacks
  src/theme.ts            # cyber-green dark UI
  src/data/services.ts    # actions mirrored from web ActionGrid
  src/context/AppState.tsx
  src/screens/            # Home, Service, Aegis, Logs, Docs, Settings
```

## Ship builds later

```bash
npx expo prebuild
# or EAS Build when you add eas.json + Apple/Google credentials
```

Canonical monorepo: **https://github.com/barker6969/Aether6969**
