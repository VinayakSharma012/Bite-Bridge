package com.bitebridge.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mongo.MongoClientSettingsBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Bean
    public MongoClientSettingsBuilderCustomizer mongoClientSettingsBuilderCustomizer(
        @Value("${app.mongodb.server-selection-timeout-ms:10000}") long serverSelectionTimeoutMs,
        @Value("${app.mongodb.connect-timeout-ms:10000}") int connectTimeoutMs,
        @Value("${app.mongodb.read-timeout-ms:20000}") int readTimeoutMs,
        @Value("${app.mongodb.max-connection-pool-size:50}") int maxPoolSize,
        @Value("${app.mongodb.min-connection-pool-size:5}") int minPoolSize,
        @Value("${app.mongodb.max-connection-idle-time-ms:60000}") long maxConnectionIdleTimeMs
    ) {
    return builder -> builder
        .applyToClusterSettings(cluster -> cluster.serverSelectionTimeout(serverSelectionTimeoutMs, TimeUnit.MILLISECONDS))
        .applyToSocketSettings(socket -> socket
            .connectTimeout(connectTimeoutMs, TimeUnit.MILLISECONDS)
            .readTimeout(readTimeoutMs, TimeUnit.MILLISECONDS)
        )
        .applyToConnectionPoolSettings(pool -> pool
            .maxSize(maxPoolSize)
            .minSize(minPoolSize)
            .maxConnectionIdleTime(maxConnectionIdleTimeMs, TimeUnit.MILLISECONDS)
        )
        .retryWrites(true);
    }
}
