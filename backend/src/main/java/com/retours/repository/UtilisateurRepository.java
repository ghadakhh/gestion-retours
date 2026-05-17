package com.retours.repository;

import com.retours.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    // Vérifie si un email existe déjà dans la base
    // SELECT COUNT(*) FROM utilisateur WHERE email = ?
    boolean existsByEmail(String email);
}
