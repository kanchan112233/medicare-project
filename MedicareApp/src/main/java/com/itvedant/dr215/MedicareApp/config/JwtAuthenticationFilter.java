package com.itvedant.dr215.MedicareApp.config;

import com.itvedant.dr215.MedicareApp.entity.User;
import com.itvedant.dr215.MedicareApp.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String SECRET_KEY =
            "MedicareAppSecureSecretKeyForJWTAuthenticationSignature";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8)
            );

    private final UserRepository userRepository;

    public JwtAuthenticationFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String generateToken(User user) {

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole())
                .claim("userId", user.getId())
                .claim("name", user.getName())
                .issuedAt(new java.util.Date())
                .expiration(
                        new java.util.Date(
                                System.currentTimeMillis() + 86400000
                        )
                )
                .signWith(key)
                .compact();
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            String token = authHeader.substring(7);

            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();

            User user = userRepository
                    .findByEmail(email)
                    .orElse(null);

            if (user != null &&
                    SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                String role = user.getRole();

                if (role.startsWith("ROLE_")) {
                    role = role.substring(5);
                }

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                Collections.singletonList(authority)
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(auth);
            }

        } catch (Exception e) {

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType("application/json");

            response.getWriter().write("""
                {
                    "message":"Invalid Token"
                }
                """);

            return;
        }

        filterChain.doFilter(request, response);
    }
}