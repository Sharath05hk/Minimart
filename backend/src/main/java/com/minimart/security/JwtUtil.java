package com.minimart.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    private final Key key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expirationMs}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(ensureBase64(secret)));
        this.expirationMs = expirationMs;
    }

    private String ensureBase64(String s) {
        // If it's not base64, base64-encode. Simplified check.
        try {
            Decoders.BASE64.decode(s);
            return s;
        } catch (Exception e) {
            return io.jsonwebtoken.io.Encoders.BASE64.encode(s.getBytes());
        }
    }

    public String generate(String subject, Map<String, Object> claims) {
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getSubject(String token) {
        return parser().parseClaimsJws(token).getBody().getSubject();
    }

    public Claims getAllClaims(String token) {
        return parser().parseClaimsJws(token).getBody();
    }

    public boolean validate(String token) {
        try {
            parser().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    private JwtParser parser() {
        return Jwts.parserBuilder().setSigningKey(key).build();
    }
}
