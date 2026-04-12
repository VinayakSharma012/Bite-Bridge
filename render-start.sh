#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="${ROOT_DIR}/.render-tools"
BUNDLED_JAVA="${TOOLS_DIR}/jdk-17/bin/java"

if ! command -v java >/dev/null 2>&1 && [ -x "${BUNDLED_JAVA}" ]; then
	export JAVA_HOME="${TOOLS_DIR}/jdk-17"
	export PATH="${JAVA_HOME}/bin:${PATH}"
fi

if ! command -v java >/dev/null 2>&1; then
	echo "[render-start] Java not found at runtime. Bootstrapping JRE 17..."
	mkdir -p "${TOOLS_DIR}"
	JRE_DIR="${TOOLS_DIR}/jre-17"
	if [ ! -x "${JRE_DIR}/bin/java" ]; then
		JRE_URL_PRIMARY="https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jre/hotspot/normal/eclipse"
		JRE_URL_FALLBACK="https://api.adoptium.net/v3/binary/latest/17/ga/linux/x64/jre/hotspot/normal/adoptium"

		if ! curl -fsSL "${JRE_URL_PRIMARY}" -o /tmp/jre17.tar.gz; then
			echo "[render-start] Primary JRE URL failed, trying fallback..."
			curl -fsSL "${JRE_URL_FALLBACK}" -o /tmp/jre17.tar.gz
		fi

		rm -rf "${JRE_DIR}"
		mkdir -p "${JRE_DIR}"
		tar -xzf /tmp/jre17.tar.gz --strip-components=1 -C "${JRE_DIR}"
	fi

	export JAVA_HOME="${JRE_DIR}"
	export PATH="${JAVA_HOME}/bin:${PATH}"
fi

cd backend
exec java \
	-Dserver.port="${PORT:-8080}" \
	-Djdk.tls.client.protocols=TLSv1.2 \
	-Dhttps.protocols=TLSv1.2 \
	-Xmx512m \
	-Xms256m \
	-XX:+UseG1GC \
	-XX:MaxGCPauseMillis=200 \
	-Dspring.jpa.hibernate.ddl-auto=validate \
	-jar target/*.jar