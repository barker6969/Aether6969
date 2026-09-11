/**
 * Build aether-cli and place it where Tauri externalBin expects it:
 *   src-tauri/binaries/aether-cli-<target-triple>[.exe]
 *
 * Runs as beforeDevCommand / beforeBuildCommand from tauri.conf.json.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const desktopRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(desktopRoot, "..");
const cliDir = path.join(repoRoot, "aether-cli");
const binariesDir = path.join(desktopRoot, "src-tauri", "binaries");

function hostTriple() {
  try {
    const out = execSync("rustc -vV", { encoding: "utf8" });
    const line = out.split("\n").find((l) => l.startsWith("host:"));
    if (line) return line.replace("host:", "").trim();
  } catch (_) {}
  // Fallbacks
  if (process.platform === "win32") return "x86_64-pc-windows-msvc";
  if (process.platform === "darwin")
    return process.arch === "arm64"
      ? "aarch64-apple-darwin"
      : "x86_64-apple-darwin";
  return "x86_64-unknown-linux-gnu";
}

function main() {
  if (!fs.existsSync(path.join(cliDir, "Cargo.toml"))) {
    console.warn("[prepare-cli-sidecar] aether-cli not found — skip");
    process.exit(0);
  }

  console.log("[prepare-cli-sidecar] cargo build --release (aether-cli)");
  execSync("cargo build --release", {
    cwd: cliDir,
    stdio: "inherit",
    env: process.env,
  });

  const triple = hostTriple();
  const isWin = process.platform === "win32";
  const srcName = isWin ? "aether-cli.exe" : "aether-cli";
  const src = path.join(cliDir, "target", "release", srcName);
  if (!fs.existsSync(src)) {
    console.error("[prepare-cli-sidecar] missing binary:", src);
    process.exit(1);
  }

  fs.mkdirSync(binariesDir, { recursive: true });
  const destName = isWin
    ? `aether-cli-${triple}.exe`
    : `aether-cli-${triple}`;
  const dest = path.join(binariesDir, destName);
  fs.copyFileSync(src, dest);
  try {
    fs.chmodSync(dest, 0o755);
  } catch (_) {}

  console.log("[prepare-cli-sidecar] wrote", dest);
}

main();
