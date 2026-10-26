package com.itvedant.dr215.MedicareApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Allows secure cross-origin traffic from your React Vite development client port
        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        // Dictates allowed HTTP transaction methods across the network channels
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        // Sets required communication headers, enabling JWT Bearer Authorization tracking strings
        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        // Enables cookie handling policies and authorization handshake permissions attributes
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Registers properties globally to encompass all controller resource mapping route paths
        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}