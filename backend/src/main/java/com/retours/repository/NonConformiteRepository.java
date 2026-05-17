package com.retours.repository;

import com.retours.model.NonConformite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NonConformiteRepository extends JpaRepository<NonConformite, Long> {

    // SELECT * FROM non_conformite WHERE gravite = ?
    List<NonConformite> findByGravite(String gravite);

    // SELECT * FROM non_conformite WHERE statut = ?
    List<NonConformite> findByStatut(String statut);

    // SELECT * FROM non_conformite WHERE retour_id = ?
    List<NonConformite> findByRetourId(Long retourId);
}
