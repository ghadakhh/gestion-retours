package com.retours.controller;

import com.retours.model.NonConformite;
import com.retours.service.NonConformiteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/non-conformites")
@CrossOrigin(origins = "http://localhost:4200")
public class NonConformiteController {

    @Autowired
    private NonConformiteService service;

    // GET /api/non-conformites → toutes les non-conformités
    @GetMapping
    public List<NonConformite> getToutesLesNC() {
        return service.getToutesLesNC();
    }

    // GET /api/non-conformites/{id} → une NC par son ID
    @GetMapping("/{id}")
    public ResponseEntity<NonConformite> getNCParId(@PathVariable Long id) {
        Optional<NonConformite> nc = service.getNCParId(id);
        if (nc.isPresent()) {
            return ResponseEntity.ok(nc.get());
        }
        return ResponseEntity.notFound().build();
    }

    // POST /api/non-conformites → créer une NC
    @PostMapping
    public ResponseEntity<NonConformite> creerNC(@Valid @RequestBody NonConformite nc) {
        NonConformite nouvelle = service.creerNC(nc);
        return ResponseEntity.status(201).body(nouvelle);
    }

    // PUT /api/non-conformites/{id} → modifier une NC
    @PutMapping("/{id}")
    public ResponseEntity<NonConformite> modifierNC(@PathVariable Long id,
                                                    @Valid @RequestBody NonConformite nc) {
        Optional<NonConformite> resultat = service.modifierNC(id, nc);
        if (resultat.isPresent()) {
            return ResponseEntity.ok(resultat.get());
        }
        return ResponseEntity.notFound().build();
    }

    // PATCH /api/non-conformites/{id}/resoudre → résoudre une NC
    // Corps JSON : { "actionsCorrectives": "On a remplacé la pièce défectueuse" }
    @PatchMapping("/{id}/resoudre")
    public ResponseEntity<NonConformite> resoudreNC(@PathVariable Long id,
                                                    @RequestBody Map<String, String> body) {
        String actions = body.getOrDefault("actionsCorrectives", "");
        Optional<NonConformite> resultat = service.resoudreNC(id, actions);
        if (resultat.isPresent()) {
            return ResponseEntity.ok(resultat.get());
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE /api/non-conformites/{id} → supprimer une NC
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerNC(@PathVariable Long id) {
        if (service.supprimerNC(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // GET /api/non-conformites/stats/total → nombre total de NC
    @GetMapping("/stats/total")
    public Map<String, Long> getTotal() {
        return Map.of("total", service.compterNC());
    }
}
