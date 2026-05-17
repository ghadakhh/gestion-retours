package com.retours.service;

import com.retours.model.NonConformite;
import com.retours.repository.NonConformiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NonConformiteService {

    @Autowired
    private NonConformiteRepository repository;

    // Récupérer toutes les non-conformités
    public List<NonConformite> getToutesLesNC() {
        return repository.findAll();
    }

    // Récupérer une NC par son ID
    public Optional<NonConformite> getNCParId(Long id) {
        return repository.findById(id);
    }

    // Créer une nouvelle NC
    public NonConformite creerNC(NonConformite nc) {
        nc.setStatut("OUVERTE"); // statut initial toujours OUVERTE
        return repository.save(nc);
    }

    // Modifier une NC existante
    public Optional<NonConformite> modifierNC(Long id, NonConformite ncModifiee) {
        Optional<NonConformite> opt = repository.findById(id);

        if (opt.isPresent()) {
            NonConformite nc = opt.get();
            nc.setDescription(ncModifiee.getDescription());
            nc.setGravite(ncModifiee.getGravite());
            nc.setProduit(ncModifiee.getProduit());
            nc.setStatut(ncModifiee.getStatut());
            nc.setActionsCorrectives(ncModifiee.getActionsCorrectives());
            nc.setRetourId(ncModifiee.getRetourId());
            return Optional.of(repository.save(nc));
        }

        return Optional.empty();
    }

    // Supprimer une NC
    public boolean supprimerNC(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // Résoudre une NC : on passe son statut à RESOLUE et on note les actions correctives
    public Optional<NonConformite> resoudreNC(Long id, String actionsCorrectives) {
        Optional<NonConformite> opt = repository.findById(id);

        if (opt.isPresent()) {
            NonConformite nc = opt.get();
            nc.setStatut("RESOLUE");
            nc.setActionsCorrectives(actionsCorrectives);
            return Optional.of(repository.save(nc));
        }

        return Optional.empty();
    }

    // Compter le total
    public long compterNC() {
        return repository.count();
    }
}
