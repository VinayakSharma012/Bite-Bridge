#!/usr/bin/env bash
set -euo pipefail

echo "[render-build] Building frontend..."
cd frontend
npm ci
npm run build

cd ..
echo "[render-build] Copying frontend dist into backend static resources..."
rm -rf backend/src/main/resources/static
mkdir -p backend/src/main/resources/static
cp -R frontend/dist/. backend/src/main/resources/static/

echo "[render-build] Packaging Spring Boot app..."
cd backend
mvn -q clean package -DskipTests

echo "[render-build] Done. Jar created under backend/target/."