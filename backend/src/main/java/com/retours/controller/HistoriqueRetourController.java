package com.retours.controller;

import com.retours.model.HistoriqueRetour;
import com.retours.service.HistoriqueRetourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historique")
@CrossOrigin(origins = "http://localhost:4200")
public class HistoriqueRetourController {

    @Autowired
    private HistoriqueRetourService service;

    // GET /api/historique/retour/{retourId}
    // Récupère l'historique complet d'un retour spécifique
    // Trié du plus récent au plus ancien
    @GetMapping("/retour/{retourId}")
    public List<HistoriqueRetour> getHistoriqueParRetour(@PathVariable Long retourId) {
        return service.getHistoriqueParRetour(retourId);
    }

    // GET /api/historique → tout l'historique (toutes actions confondues)
    @GetMapping
    public List<HistoriqueRetour> getToutLHistorique() {
        return service.getToutLHistorique();
    }
}
