package com.retours.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

// @Configuration = cette classe contient des configurations Spring
@Configuration
public class CorsConfig {

    // CORS = Cross-Origin Resource Sharing
    // Problème : le navigateur bloque par sécurité les requêtes entre
    //            Angular (port 4200) et Spring Boot (port 8080)
    // Solution : on dit à Spring Boot d'autoriser Angular à le contacter

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Autoriser les requêtes venant du frontend Angular
        config.addAllowedOrigin("http://localhost:4200");

        // Autoriser toutes les méthodes HTTP (GET, POST, PUT, DELETE)
        config.addAllowedMethod("*");

        // Autoriser tous les en-têtes HTTP
        config.addAllowedHeader("*");

        // Appliquer cette configuration à toutes les URLs qui commencent par /api/
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
