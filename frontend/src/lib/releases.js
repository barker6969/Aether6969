// Shared release version + base URLs for native binaries.
// When CI bumps these via git tag, update both constants here — and only here.
//
//   • DESKTOP_VERSION matches the version in aether-desktop/src-tauri/tauri.conf.json
//     and the workflow tag `desktop-vX.Y.Z` (e.g. desktop-v0.1.0).
//   • CLI_VERSION matches the Cargo.toml version in aether-cli and the
//     workflow tag `vX.Y.Z` (e.g. v0.1.0).
//
// Download buttons (DownloadDesktopButton, DownloadCliButton,
// GetDesktopHeroCard) import these to construct GitHub Release URLs.

export const DESKTOP_VERSION = "0.1.0";
export const CLI_VERSION = "0.2.0";

// Prefer the tagged release so links stay valid even before /latest resolves.
// Override with REACT_APP_GITHUB_RELEASES_URL if you host elsewhere.
export const DESKTOP_RELEASES_BASE =
  process.env.REACT_APP_GITHUB_RELEASES_URL ||
  `https://github.com/barker6969/Aether6969/releases/download/desktop-v${DESKTOP_VERSION}`;

export const CLI_RELEASES_BASE =
  process.env.REACT_APP_CLI_RELEASES_URL ||
  `https://github.com/barker6969/Aether6969/releases/download/v${CLI_VERSION}`;
