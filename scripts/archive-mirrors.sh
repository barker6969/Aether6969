#!/usr/bin/env bash
# Archive deprecated Aether mirror repositories.
# Requires: GitHub CLI (`gh auth login`) OR GITHUB_TOKEN / GH_TOKEN with admin on those repos.
#
# Usage:
#   ./scripts/archive-mirrors.sh
#   GITHUB_TOKEN=ghp_xxx ./scripts/archive-mirrors.sh

set -euo pipefail

OWNER="${GITHUB_OWNER:-barker6969}"
MIRRORS=(
  aether
  aether-phones
  Aether69
  aether.exe
)

archive_one() {
  local repo="$1"
  local full="${OWNER}/${repo}"

  if command -v gh >/dev/null 2>&1; then
    echo "→ gh repo archive ${full}"
    # --yes skips confirmation; fails softly if already archived
    if gh api "repos/${full}" --jq '.archived' 2>/dev/null | grep -q true; then
      echo "  already archived: ${full}"
      return 0
    fi
    gh repo archive "${full}" --yes
    echo "  archived: ${full}"
    return 0
  fi

  local token="${GITHUB_TOKEN:-${GH_TOKEN:-}}"
  if [[ -z "${token}" ]]; then
    echo "error: need `gh` logged in, or set GITHUB_TOKEN / GH_TOKEN" >&2
    exit 1
  fi

  echo "→ API PATCH repos/${full} archived=true"
  local code
  code=$(curl -sS -o /tmp/archive-resp.json -w "%{http_code}" \
    -X PATCH "https://api.github.com/repos/${full}" \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${token}" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -d '{"archived":true}')

  if [[ "${code}" == "200" ]]; then
    echo "  archived: ${full}"
  else
    echo "  failed (${code}): ${full}" >&2
    cat /tmp/archive-resp.json >&2 || true
    return 1
  fi
}

echo "Archiving mirror repos under ${OWNER} (canonical remains Aether6969)"
echo

fail=0
for r in "${MIRRORS[@]}"; do
  archive_one "${r}" || fail=1
done

echo
if [[ "${fail}" -eq 0 ]]; then
  echo "Done. Canonical repo: https://github.com/${OWNER}/Aether6969"
else
  echo "Finished with errors — check token scopes (needs admin on each repo)." >&2
  exit 1
fi
