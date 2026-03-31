#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="${ROOT_DIR}/.render-tools"
JDK_DIR="${TOOLS_DIR}/jdk-17"

mkdir -p "${TOOLS_DIR}"

if ! command -v java >/dev/null 2>&1; then
	echo "[render-build] Java not found. Bootstrapping JDK 17..."
	if [ ! -x "${JDK_DIR}/bin/java" ]; then
		JDK_URL_PRIMARY="https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/eclipse"
		JDK_URL_FALLBACK_1="https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jdk/hotspot/normal/adoptium"
		JDK_URL_FALLBACK_2="https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz"

		if ! curl -fsSL "${JDK_URL_PRIMARY}" -o /tmp/jdk17.tar.gz; then
			echo "[render-build] Primary JDK URL failed, trying fallback #1..."
			if ! curl -fsSL "${JDK_URL_FALLBACK_1}" -o /tmp/jdk17.tar.gz; then
				echo "[render-build] Fallback #1 failed, trying fallback #2..."
				curl -fsSL "${JDK_URL_FALLBACK_2}" -o /tmp/jdk17.tar.gz
			fi
		fi

		rm -rf "${JDK_DIR}"
		mkdir -p "${JDK_DIR}"
		tar -xzf /tmp/jdk17.tar.gz --strip-components=1 -C "${JDK_DIR}"
	fi
	export JAVA_HOME="${JDK_DIR}"
	export PATH="${JAVA_HOME}/bin:${PATH}"
fi

if ! command -v java >/dev/null 2>&1; then
	echo "[render-build] ERROR: Java is not available in this Render runtime."
	echo "[render-build] Java bootstrap failed."
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