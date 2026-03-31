#!/usr/bin/env bash
set -euo pipefail

cd backend
exec java -Dserver.port="${PORT:-8080}" -jar target/*.jar