#!/usr/bin/env bash
set -euo pipefail

if ! command -v java >/dev/null 2>&1; then
	echo "[render-build] ERROR: Java is not available in this Render runtime."
	echo "[render-build] Use Render Native runtime with Java environment, then retry."
	exit 1
fi

if ! command -v mvn >/dev/null 2>&1; then
	echo "[render-build] Maven not found. Bootstrapping local Maven..."
	MAVEN_VERSION="3.9.9"
	MAVEN_DIR="/tmp/apache-maven-${MAVEN_VERSION}"
	if [ ! -d "${MAVEN_DIR}" ]; then
		curl -fsSL "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -o /tmp/maven.tar.gz
		tar -xzf /tmp/maven.tar.gz -C /tmp
	fi
	export PATH="${MAVEN_DIR}/bin:${PATH}"
fi

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