package com.intellifill.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Chrome extensions call this backend from a "chrome-extension://<id>"
 * origin - and during local testing (a plain .html file opened directly
 * in the browser), the origin is "null" / "file://". Browsers block both
 * of these by default unless the server explicitly allows them via CORS.
 *
 * DEV NOTE: allowedOrigins("*") is intentionally permissive here because
 * we don't use cookies/sessions (JWT is sent via the Authorization header,
 * not a cookie), so allowCredentials is false and "*" is safe. Before
 * publishing the extension, tighten this to your actual extension ID:
 * "chrome-extension://<your-actual-extension-id>" - see Security
 * Requirements: keep dev and production CORS configuration separate.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
