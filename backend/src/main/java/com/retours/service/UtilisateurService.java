package com.retours.service;

import com.retours.model.Utilisateur;
import com.retours.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository repository;

    // Récupérer tous les utilisateurs
    public List<Utilisateur> getTousLesUtilisateurs() {
        return repository.findAll();
    }

    // Récupérer un utilisateur par son ID
    public Optional<Utilisateur> getUtilisateurParId(Long id) {
        return repository.findById(id);
    }

    // Créer un nouvel utilisateur
    // On vérifie d'abord que l'email n'existe pas déjà
    public Utilisateur creerUtilisateur(Utilisateur utilisateur) {
        if (repository.existsByEmail(utilisateur.getEmail())) {
            // On lance une exception simple (pas besoin d'une classe spéciale)
            throw new RuntimeException("Un utilisateur avec cet email existe déjà.");
        }
        return repository.save(utilisateur);
    }

    // Modifier un utilisateur existant
    public Optional<Utilisateur> modifierUtilisateur(Long id, Utilisateur u) {
        Optional<Utilisateur> opt = repository.findById(id);

        if (opt.isPresent()) {
            Utilisateur existant = opt.get();
            existant.setNom(u.getNom());
            existant.setRole(u.getRole());
            // On ne modifie pas l'email pour éviter les doublons
            return Optional.of(repository.save(existant));
        }

        return Optional.empty();
    }

    // Supprimer un utilisateur
    public boolean supprimerUtilisateur(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    // Compter le total
    public long compterUtilisateurs() {
        return repository.count();
    }
}
