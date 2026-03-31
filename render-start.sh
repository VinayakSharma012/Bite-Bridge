#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUNDLED_JAVA="${ROOT_DIR}/.render-tools/jdk-17/bin/java"

if ! command -v java >/dev/null 2>&1 && [ -x "${BUNDLED_JAVA}" ]; then
	export JAVA_HOME="${ROOT_DIR}/.render-tools/jdk-17"
	export PATH="${JAVA_HOME}/bin:${PATH}"
fi

if ! command -v java >/dev/null 2>&1; then
	echo "[render-start] ERROR: Java is not available."
	echo "[render-start] Ensure build step ran successfully so bundled JDK exists at .render-tools/jdk-17."
	exit 1
fi

cd backend
exec java -Dserver.port="${PORT:-8080}" -jar target/*.jar