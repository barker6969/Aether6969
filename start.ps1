# Aether — one-command local start (Windows PowerShell)
# Usage:  .\start.ps1
# Optional: .\start.ps1 -Bridge   (also starts USB CLI if built)

param(
  [switch]$Bridge,
  [switch]$NoInstall
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $Root

function Write-Step($msg) {
  Write-Host ""
  Write-Host "==> $msg" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "  AETHER REPAIR TOOL  ·  local start" -ForegroundColor Green
Write-Host "  ==================================" -ForegroundColor DarkGreen

# --- Node check ---
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js not found. Install Node 20 LTS from https://nodejs.org then re-run." -ForegroundColor Red
  exit 1
}
$nodeVer = (node -v)
Write-Host "  Node $nodeVer"

# --- Frontend env (no-auth by default for seamless local) ---
$fe = Join-Path $Root "frontend"
if (-not (Test-Path (Join-Path $fe ".env"))) {
  Write-Step "Creating frontend/.env (no-auth demo mode)"
  if (Test-Path (Join-Path $fe ".env.example")) {
    Copy-Item (Join-Path $fe ".env.example") (Join-Path $fe ".env")
  } else {
    @(
      "REACT_APP_BACKEND_URL=",
      "REACT_APP_NO_AUTH=true"
    ) | Set-Content -Path (Join-Path $fe ".env") -Encoding UTF8
  }
}

# Prefer REACT_APP_NO_AUTH=true in existing .env if missing
$envPath = Join-Path $fe ".env"
$envText = Get-Content $envPath -Raw -ErrorAction SilentlyContinue
if ($envText -notmatch "REACT_APP_NO_AUTH") {
  Add-Content $envPath "`nREACT_APP_NO_AUTH=true"
}

# --- Install + start frontend ---
Set-Location $fe
if (-not $NoInstall) {
  Write-Step "Installing frontend dependencies (first run can take a few minutes)"
  if (Get-Command yarn -ErrorAction SilentlyContinue) {
    yarn install
  } else {
    npm install --legacy-peer-deps
  }
  # Harden CRA/ajv on newer Node if needed
  npm install ajv@8.17.1 --save-exact --legacy-peer-deps 2>$null | Out-Null
}

Write-Step "Starting dashboard → http://localhost:3000"
Write-Host "  Guest mode on (no login). Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host ""

# Optional USB bridge in second window
if ($Bridge) {
  $cliDir = Join-Path $Root "aether-cli"
  $exe = Join-Path $cliDir "target\release\aether-cli.exe"
  if (-not (Test-Path $exe)) {
    if (Get-Command cargo -ErrorAction SilentlyContinue) {
      Write-Step "Building aether-cli (release)"
      Push-Location $cliDir
      cargo build --release
      Pop-Location
    } else {
      Write-Host "  cargo not found — skip bridge. Install Rust or use released CLI ZIP." -ForegroundColor Yellow
    }
  }
  if (Test-Path $exe) {
    Write-Step "Starting USB bridge (ws://127.0.0.1:8765)"
    Start-Process -FilePath $exe -ArgumentList "serve" -WorkingDirectory $cliDir -WindowStyle Normal
    Write-Host "  Bridge window opened. In the app: Enable CLI bridge if needed." -ForegroundColor DarkGray
  }
}

$env:BROWSER = "none"
if (Get-Command yarn -ErrorAction SilentlyContinue) {
  yarn start
} else {
  npm start
}
