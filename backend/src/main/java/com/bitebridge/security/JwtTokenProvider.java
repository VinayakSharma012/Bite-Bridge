package com.bitebridge.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.logging.Logger;

@Component
public class JwtTokenProvider {

    private static final Logger logger = Logger.getLogger(JwtTokenProvider.class.getName());

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationMs;

    @Value("${jwt.refresh-expiration:604800000}")
    private int refreshTokenExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String email) {
        return generateTokenFromEmail(email, jwtExpirationMs);
    }

    public String generateRefreshToken(String email) {
        return generateTokenFromEmail(email, refreshTokenExpirationMs);
    }

    private String generateTokenFromEmail(String email, int expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            logger.warning("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            logger.warning("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.warning("Expired JWT token: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.warning("Unsupported JWT token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.warning("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    public long getExpirationTime() {
        return jwtExpirationMs;
    }
}
