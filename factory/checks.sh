#!/usr/bin/env bash
# The repo's checks. Exit 0 only when the branch is fit to review.
#
# The gate runs this script from the main checkout with the job's worktree as
# the working directory. Keep it fast, deterministic and non-interactive: no
# watch modes, no prompts, nothing that rewrites files.
#
# INSTALL.md replaces the line below with this project's real commands, e.g.:
#
#   npm ci --prefer-offline
#   npm run lint
#   npm run typecheck
#   npm test -- --run
#   npm run build
set -euo pipefail

# routine-maker is a dependency-free static site: index.html with one inline
# <script>, a service worker and a manifest. There is no package manager, test
# suite or build, so the checks are syntax checks.
command -v node >/dev/null || { echo "node is required for checks" >&2; exit 1; }

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

python3 - "$tmp" <<'PY'
import re, sys
html = open("index.html", encoding="utf-8").read()
scripts = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", html, re.S)
if not scripts:
    sys.exit("index.html has no inline <script>")
for n, body in enumerate(scripts):
    open(f"{sys.argv[1]}/inline-{n}.js", "w", encoding="utf-8").write(body)
PY

for f in "$tmp"/inline-*.js sw.js; do
  echo "syntax check: $f"
  node --check "$f"
done

echo "json check: manifest.webmanifest vercel.json"
python3 -m json.tool manifest.webmanifest >/dev/null
python3 -m json.tool vercel.json >/dev/null

echo "checks passed"
