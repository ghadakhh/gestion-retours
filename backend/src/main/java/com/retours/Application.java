package com.retours;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication = démarre toute l'application Spring Boot
// Cette annotation active automatiquement :
//   - la détection des composants (@Controller, @Service, @Repository)
//   - la configuration automatique (auto-configuration)
@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        // Lance le serveur intégré (Tomcat) sur le port 8080
        SpringApplication.run(Application.class, args);
        System.out.println("=== Application démarrée sur http://localhost:8080 ===");
    }
}
