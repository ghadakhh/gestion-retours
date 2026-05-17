package com.retours.repository;

import com.retours.model.HistoriqueRetour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistoriqueRetourRepository extends JpaRepository<HistoriqueRetour, Long> {

    // Récupère l'historique d'un retour trié du plus récent au plus ancien
    // SELECT * FROM historique_retour WHERE retour_id = ? ORDER BY date DESC
    List<HistoriqueRetour> findByRetourIdOrderByDateDesc(Long retourId);
}
