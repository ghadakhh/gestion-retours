package com.retours.repository;

import com.retours.model.RetourProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// @Repository = indique à Spring que cette interface accède à la base de données
//
// JpaRepository<RetourProduit, Long> nous donne GRATUITEMENT ces méthodes :
//   save(retour)       → INSERT ou UPDATE en base
//   findById(id)       → SELECT * WHERE id = ?
//   findAll()          → SELECT * FROM retour_produit
//   deleteById(id)     → DELETE WHERE id = ?
//   existsById(id)     → vérifie si l'enregistrement existe
//   count()            → COUNT(*)
//
// Spring génère automatiquement le SQL. On n'écrit pas de SQL manuellement !

@Repository
public interface RetourProduitRepository extends JpaRepository<RetourProduit, Long> {

    // Spring lit le nom de la méthode et génère le SQL correspondant :
    // findByEtatTraitement("EN_ATTENTE")
    // → SELECT * FROM retour_produit WHERE etat_traitement = 'EN_ATTENTE'
    List<RetourProduit> findByEtatTraitement(String etatTraitement);

    // SELECT * FROM retour_produit WHERE client LIKE '%ahmed%' (insensible à la casse)
    List<RetourProduit> findByClientContainingIgnoreCase(String client);
}
