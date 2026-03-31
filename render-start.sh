#!/usr/bin/env bash
set -euo pipefail

if ! command -v java >/dev/null 2>&1; then
	echo "[render-start] ERROR: Java is not available. Configure Render service with Java runtime."
	exit 1
fi

cd backend
exec java -Dserver.port="${PORT:-8080}" -jar target/*.jar