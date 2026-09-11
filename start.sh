#!/usr/bin/env bash
# Aether — one-command local start (macOS / Linux)
# Usage:  ./start.sh
#         ./start.sh --bridge   # also start USB CLI if available

set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

BRIDGE=0
NO_INSTALL=0
for arg in "$@"; do
  case "$arg" in
    --bridge|-b) BRIDGE=1 ;;
    --no-install) NO_INSTALL=1 ;;
  esac
done

echo ""
echo "  AETHER REPAIR TOOL  ·  local start"
echo "  =================================="

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js not found. Install Node 20 LTS, then re-run."
  exit 1
fi
echo "  Node $(node -v)"

FE="$ROOT/frontend"
if [ ! -f "$FE/.env" ]; then
  echo ""
  echo "==> Creating frontend/.env (no-auth demo mode)"
  if [ -f "$FE/.env.example" ]; then
    cp "$FE/.env.example" "$FE/.env"
  else
    printf 'REACT_APP_BACKEND_URL=\nREACT_APP_NO_AUTH=true\n' > "$FE/.env"
  fi
fi
if ! grep -q 'REACT_APP_NO_AUTH' "$FE/.env" 2>/dev/null; then
  echo 'REACT_APP_NO_AUTH=true' >> "$FE/.env"
fi

cd "$FE"
if [ "$NO_INSTALL" -eq 0 ]; then
  echo ""
  echo "==> Installing frontend dependencies"
  if command -v yarn >/dev/null 2>&1; then
    yarn install
  else
    npm install --legacy-peer-deps
  fi
  npm install ajv@8.17.1 --save-exact --legacy-peer-deps >/dev/null 2>&1 || true
fi

if [ "$BRIDGE" -eq 1 ]; then
  CLI="$ROOT/aether-cli"
  BIN="$CLI/target/release/aether-cli"
  if [ ! -x "$BIN" ]; then
    if command -v cargo >/dev/null 2>&1; then
      echo ""
      echo "==> Building aether-cli"
      (cd "$CLI" && cargo build --release)
    else
      echo "cargo not found — skip bridge (install Rust or use release CLI)"
    fi
  fi
  if [ -x "$BIN" ]; then
    echo ""
    echo "==> Starting USB bridge on ws://127.0.0.1:8765"
    ("$BIN" serve &) 
    sleep 1
  fi
fi

echo ""
echo "==> Dashboard → http://localhost:3000"
echo "    Guest mode on (no login). Ctrl+C to stop."
echo ""

export BROWSER=none
if command -v yarn >/dev/null 2>&1; then
  exec yarn start
else
  exec npm start
fi
