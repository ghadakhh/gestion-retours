package com.retours.controller;

import com.retours.model.Utilisateur;
import com.retours.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:4200")
public class UtilisateurController {

    @Autowired
    private UtilisateurService service;

    // GET /api/utilisateurs → tous les utilisateurs
    @GetMapping
    public List<Utilisateur> getTousLesUtilisateurs() {
        return service.getTousLesUtilisateurs();
    }

    // GET /api/utilisateurs/{id} → un utilisateur par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurParId(@PathVariable Long id) {
        Optional<Utilisateur> u = service.getUtilisateurParId(id);
        if (u.isPresent()) {
            return ResponseEntity.ok(u.get());
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/utilisateurs → créer un utilisateur
    @PostMapping
    public ResponseEntity<?> creerUtilisateur(@Valid @RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur nouveau = service.creerUtilisateur(utilisateur);
            return ResponseEntity.status(201).body(nouveau);
        } catch (RuntimeException e) {
            // Si l'email existe déjà, on retourne une erreur 400
            return ResponseEntity.badRequest().body(Map.of("erreur", e.getMessage()));
        }
    }

    // PUT /api/utilisateurs/{id} → modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> modifierUtilisateur(@PathVariable Long id,
                                                           @Valid @RequestBody Utilisateur u) {
        Optional<Utilisateur> resultat = service.modifierUtilisateur(id, u);
        if (resultat.isPresent()) {
            return ResponseEntity.ok(resultat.get());
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/utilisateurs/{id} → supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Long id) {
        if (service.supprimerUtilisateur(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // GET /api/utilisateurs/stats/total → nombre total d'utilisateurs
    @GetMapping("/stats/total")
    public Map<String, Long> getTotal() {
        return Map.of("total", service.compterUtilisateurs());
    }
}
