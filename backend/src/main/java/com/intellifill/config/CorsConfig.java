package com.intellifill.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;

/**
 * Chrome extensions call this backend from a "chrome-extension://<id>"
 * origin - and during local testing (a plain .html file opened directly
 * in the browser), the origin is "null" / "file://". File origins are not
 * enabled by default; use the unpacked extension or a local HTTP server.
 *
 * Defaults allow Chrome extension origins plus local development only.
 * Set CORS_ALLOWED_ORIGINS to the exact extension ID and deployment origin
 * when publishing this backend.
 */
@Configuration
public class CorsConfig {

    @Value("${app.cors.allowed-origin-patterns:chrome-extension://*,http://localhost:*,http://127.0.0.1:*}")
    private String allowedOriginPatterns;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(allowedOriginPatterns.split("\\s*,\\s*")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
