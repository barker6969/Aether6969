// Shared release version + base URLs for native binaries.
// When CI bumps these via git tag, update constants here — and only here.
//
//   • DESKTOP_VERSION matches tauri.conf.json + tag desktop-vX.Y.Z
//   • CLI_VERSION matches aether-cli Cargo.toml + tag vX.Y.Z
//
// Actual asset names from the release pipeline use dots for spaces
// (e.g. "Aether Repair Tool" → "Aether.Repair.Tool").

export const DESKTOP_VERSION = "0.1.0";
export const CLI_VERSION = "0.2.0";

export const DESKTOP_RELEASES_BASE =
  process.env.REACT_APP_GITHUB_RELEASES_URL ||
  `https://github.com/barker6969/Aether6969/releases/download/desktop-v${DESKTOP_VERSION}`;

export const CLI_RELEASES_BASE =
  process.env.REACT_APP_CLI_RELEASES_URL ||
  `https://github.com/barker6969/Aether6969/releases/download/v${CLI_VERSION}`;

/** Filenames as published on the desktop-v* GitHub Release */
export const DESKTOP_ASSETS = {
  windows: `Aether.Repair.Tool_${DESKTOP_VERSION}_x64_en-US.msi`,
  macos: `Aether.Repair.Tool_${DESKTOP_VERSION}_universal.dmg`,
  linux: `Aether.Repair.Tool_${DESKTOP_VERSION}_amd64.AppImage`,
};
