package com.retours.service;

import com.retours.model.HistoriqueRetour;
import com.retours.repository.HistoriqueRetourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoriqueRetourService {

    @Autowired
    private HistoriqueRetourRepository repository;

    // Récupérer tout l'historique d'un retour donné
    // trié du plus récent au plus ancien
    public List<HistoriqueRetour> getHistoriqueParRetour(Long retourId) {
        return repository.findByRetourIdOrderByDateDesc(retourId);
    }

    // Récupérer tout l'historique (toutes les actions)
    public List<HistoriqueRetour> getToutLHistorique() {
        return repository.findAll();
    }
}
