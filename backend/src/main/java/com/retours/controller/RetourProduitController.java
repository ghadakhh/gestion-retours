package com.retours.controller;

import com.retours.model.RetourProduit;
import com.retours.service.RetourProduitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// @RestController = ce controller reçoit des requêtes HTTP et renvoie du JSON
// @RequestMapping = toutes les URLs de ce controller commencent par /api/retours
// @CrossOrigin    = autorise Angular (port 4200) à appeler ce controller
@RestController
@RequestMapping("/api/retours")
@CrossOrigin(origins = "http://localhost:4200")
public class RetourProduitController {

    // Spring injecte automatiquement le service
    @Autowired
    private RetourProduitService service;

    // ─── GET /api/retours ──────────────────────────────────────────────────────
    // Récupère tous les retours (avec filtre optionnel par état ou client)
    // Exemples d'appel :
    //   GET /api/retours               → tous les retours
    //   GET /api/retours?etat=EN_ATTENTE → retours en attente
    //   GET /api/retours?client=Ahmed  → retours du client Ahmed
    @GetMapping
    public List<RetourProduit> getTousLesRetours(
            @RequestParam(required = false) String etat,
            @RequestParam(required = false) String client) {

        if (etat != null) {
            return service.getParEtat(etat);
        }
        if (client != null) {
            return service.getParClient(client);
        }
        return service.getTousLesRetours();
    }

    // ─── GET /api/retours/{id} ─────────────────────────────────────────────────
    // Récupère UN retour par son identifiant
    // ResponseEntity permet de choisir le code HTTP de la réponse :
    //   200 OK si trouvé, 404 NOT FOUND si pas trouvé
    @GetMapping("/{id}")
    public ResponseEntity<RetourProduit> getRetourParId(@PathVariable Long id) {
        Optional<RetourProduit> retour = service.getRetourParId(id);

        if (retour.isPresent()) {
            return ResponseEntity.ok(retour.get()); // 200 OK
        } else {
            return ResponseEntity.notFound().build(); // 404 NOT FOUND
        }
    }

    // ─── POST /api/retours ─────────────────────────────────────────────────────
    // Crée un nouveau retour
    // @RequestBody  = les données viennent du corps de la requête (format JSON)
    // @Valid        = déclenche la validation (@NotBlank, @Min, etc.)
    @PostMapping
    public ResponseEntity<?> creerRetour(@Valid @RequestBody RetourProduit retour) {
        try {
            RetourProduit nouveau = service.creerRetour(retour);
            return ResponseEntity.status(201).body(nouveau); // 201 CREATED
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erreur", e.getMessage()));
        }
    }

    // ─── PUT /api/retours/{id} ─────────────────────────────────────────────────
    // Modifie un retour existant
    @PutMapping("/{id}")
    public ResponseEntity<?> modifierRetour(@PathVariable Long id,
                                            @Valid @RequestBody RetourProduit retour) {
        Optional<RetourProduit> resultat = service.modifierRetour(id, retour);

        if (resultat.isPresent()) {
            return ResponseEntity.ok(resultat.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── PATCH /api/retours/{id}/etat ──────────────────────────────────────────
    // Change UNIQUEMENT l'état de traitement d'un retour
    // On utilise PATCH (et non PUT) car on ne modifie qu'un seul champ
    // Corps JSON attendu : { "etat": "EN_COURS", "employe": "Marie", "commentaire": "..." }
    @PatchMapping("/{id}/etat")
    public ResponseEntity<?> changerEtat(@PathVariable Long id,
                                         @RequestBody Map<String, String> body) {
        String etat = body.get("etat");
        String employe = body.getOrDefault("employe", "Inconnu");
        String commentaire = body.get("commentaire");

        if (etat == null || etat.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erreur", "L'état est obligatoire"));
        }

        Optional<RetourProduit> resultat = service.changerEtat(id, etat, employe, commentaire);

        if (resultat.isPresent()) {
            return ResponseEntity.ok(resultat.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── DELETE /api/retours/{id} ──────────────────────────────────────────────
    // Supprime un retour
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerRetour(@PathVariable Long id) {
        boolean supprime = service.supprimerRetour(id);

        if (supprime) {
            return ResponseEntity.noContent().build(); // 204 NO CONTENT
        } else {
            return ResponseEntity.notFound().build();  // 404 NOT FOUND
        }
    }

    // ─── GET /api/retours/stats/total ──────────────────────────────────────────
    // Retourne le nombre total de retours (pour le tableau de bord)
    @GetMapping("/stats/total")
    public Map<String, Long> getTotal() {
        return Map.of("total", service.compterRetours());
    }
}
