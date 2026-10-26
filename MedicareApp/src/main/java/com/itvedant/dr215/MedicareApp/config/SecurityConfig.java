package com.itvedant.dr215.MedicareApp.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CorsConfigurationSource corsConfigurationSource) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http

                .csrf(AbstractHttpConfigurer::disable)

                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource)
                )

                .formLogin(AbstractHttpConfigurer::disable)

                .httpBasic(AbstractHttpConfigurer::disable)

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(ex -> ex

                        .authenticationEntryPoint((request, response, authException) -> {

                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");

                            response.getWriter().write("""
                                {
                                   "message":"Authentication Required"
                                }
                                """);
                        })

                        .accessDeniedHandler((request, response, accessDeniedException) -> {

                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");

                            response.getWriter().write("""
                                {
                                    "message":"Access Denied"
                                }
                                """);
                        })
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/error")
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/medicare/user/login",
                                "/medicare/user/saveUser"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/medicare/doctor/**",
                                "/medicare/medicine/**",
                                "/medicare/labtest/**",
                                "/medicare/labtests/**"
                        )
                        .permitAll()

                        .requestMatchers("/medicare/admin/**")
                        .hasRole("ADMIN")

                        .requestMatchers("/medicare/cartitem/**")
                        .hasAnyRole("USER", "ADMIN", "PATIENT")

                        .requestMatchers("/medicare/order/**")
                        .hasAnyRole("USER", "ADMIN", "PATIENT")

                        .requestMatchers("/medicare/appointment/**")
                        .hasAnyRole("USER", "ADMIN", "PATIENT")

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}