// Shared release version + base URLs for native binaries.
// When CI bumps these via git tag, update constants here — and only here.
//
//   • DESKTOP_VERSION matches tauri.conf.json + tag desktop-vX.Y.Z
//   • CLI_VERSION matches aether-cli Cargo.toml + tag vX.Y.Z
//
// Asset names must match exactly what the GitHub Actions workflows publish.

export const DESKTOP_VERSION = "0.1.0";
export const CLI_VERSION = "0.1.1";

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

/**
 * CLI asset names produced by .github/workflows/aether-cli-release.yml
 * (no version in the filename — version comes from the tag)
 */
export const CLI_ASSETS = {
  "windows-x64": "aether-cli-x86_64-pc-windows-msvc.zip",
  "darwin-x64": "aether-cli-x86_64-apple-darwin.tar.gz",
  "darwin-arm64": "aether-cli-aarch64-apple-darwin.tar.gz",
  "linux-x64": "aether-cli-x86_64-unknown-linux-gnu.tar.gz",
};

/**
 * Optional SHA256 checksums.
 * Populate these after a release is published (from the release assets or CI logs).
 * Leave empty string to hide the checksum row.
 */
export const DESKTOP_SHA256 = {
  windows: "",
  macos: "",
  linux: "",
};

export const CLI_SHA256 = {
  "windows-x64": "",
  "darwin-x64": "",
  "darwin-arm64": "",
  "linux-x64": "",
};
