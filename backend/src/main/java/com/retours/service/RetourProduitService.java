package com.retours.service;

import com.retours.model.HistoriqueRetour;
import com.retours.model.RetourProduit;
import com.retours.repository.HistoriqueRetourRepository;
import com.retours.repository.RetourProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// @Service = indique à Spring que cette classe contient la logique métier
// Elle fait le lien entre le Controller (qui reçoit les requêtes HTTP)
// et le Repository (qui parle à la base de données)
@Service
public class RetourProduitService {

    // @Autowired = Spring crée automatiquement l'objet et l'injecte ici
    // On n'a pas besoin d'écrire : new RetourProduitRepository()
    @Autowired
    private RetourProduitRepository retourRepository;

    @Autowired
    private HistoriqueRetourRepository historiqueRepository;

    // ─── RÉCUPÉRER TOUS LES RETOURS ───────────────────────────────────────────
    public List<RetourProduit> getTousLesRetours() {
        // findAll() → SELECT * FROM retour_produit
        return retourRepository.findAll();
    }

    // ─── RÉCUPÉRER UN RETOUR PAR SON ID ───────────────────────────────────────
    // Optional = le retour peut exister ou pas
    public Optional<RetourProduit> getRetourParId(Long id) {
        // findById(id) → SELECT * FROM retour_produit WHERE id = ?
        return retourRepository.findById(id);
    }

    // ─── CRÉER UN NOUVEAU RETOUR ───────────────────────────────────────────────
    public RetourProduit creerRetour(RetourProduit retour) {
        // On force l'état initial à EN_ATTENTE
        retour.setEtatTraitement("EN_ATTENTE");

        // save() → INSERT INTO retour_produit (...)
        RetourProduit retourSauve = retourRepository.save(retour);

        // On enregistre cette action dans l'historique
        enregistrerHistorique(
            retourSauve.getId(),
            "Retour créé pour le produit : " + retour.getProduit(),
            "Système"
        );

        return retourSauve;
    }

    // ─── MODIFIER UN RETOUR EXISTANT ───────────────────────────────────────────
    public Optional<RetourProduit> modifierRetour(Long id, RetourProduit retourModifie) {
        // On cherche d'abord si le retour existe
        Optional<RetourProduit> optRetour = retourRepository.findById(id);

        if (optRetour.isPresent()) {
            // Le retour existe → on met à jour ses champs
            RetourProduit retour = optRetour.get();
            retour.setProduit(retourModifie.getProduit());
            retour.setClient(retourModifie.getClient());
            retour.setEmailClient(retourModifie.getEmailClient());
            retour.setRaison(retourModifie.getRaison());
            retour.setQuantite(retourModifie.getQuantite());
            retour.setCommentaire(retourModifie.getCommentaire());

            // save() sur un objet qui a déjà un ID → UPDATE
            RetourProduit retourMisAJour = retourRepository.save(retour);

            enregistrerHistorique(id, "Retour modifié", "Utilisateur");

            return Optional.of(retourMisAJour);
        }

        // Le retour n'existe pas → on retourne un Optional vide
        return Optional.empty();
    }

    // ─── CHANGER L'ÉTAT DE TRAITEMENT ─────────────────────────────────────────
    // C'est la fonction la plus importante du projet !
    // Un agent change : EN_ATTENTE → EN_COURS → VALIDE
    public Optional<RetourProduit> changerEtat(Long id, String nouvelEtat, String employe, String commentaire) {
        Optional<RetourProduit> optRetour = retourRepository.findById(id);

        if (optRetour.isPresent()) {
            RetourProduit retour = optRetour.get();
            String ancienEtat = retour.getEtatTraitement();

            retour.setEtatTraitement(nouvelEtat);
            retourRepository.save(retour);

            // On trace le changement d'état dans l'historique
            HistoriqueRetour h = new HistoriqueRetour();
            h.setRetourId(id);
            h.setAction("Statut changé : " + ancienEtat + " → " + nouvelEtat);
            h.setEmploye(employe);
            h.setDate(LocalDateTime.now());
            h.setCommentaire(commentaire);
            historiqueRepository.save(h);

            return Optional.of(retour);
        }

        return Optional.empty();
    }

    // ─── SUPPRIMER UN RETOUR ───────────────────────────────────────────────────
    public boolean supprimerRetour(Long id) {
        if (retourRepository.existsById(id)) {
            // deleteById() → DELETE FROM retour_produit WHERE id = ?
            retourRepository.deleteById(id);
            return true; // suppression réussie
        }
        return false; // retour introuvable
    }

    // ─── FILTRER PAR ÉTAT ──────────────────────────────────────────────────────
    public List<RetourProduit> getParEtat(String etat) {
        return retourRepository.findByEtatTraitement(etat);
    }

    // ─── FILTRER PAR NOM DE CLIENT ─────────────────────────────────────────────
    public List<RetourProduit> getParClient(String client) {
        return retourRepository.findByClientContainingIgnoreCase(client);
    }

    // ─── COMPTER LE NOMBRE TOTAL ───────────────────────────────────────────────
    public long compterRetours() {
        return retourRepository.count();
    }

    // ─── MÉTHODE PRIVÉE : enregistre une ligne dans l'historique ──────────────
    // private = utilisée seulement à l'intérieur de cette classe
    private void enregistrerHistorique(Long retourId, String action, String employe) {
        HistoriqueRetour h = new HistoriqueRetour();
        h.setRetourId(retourId);
        h.setAction(action);
        h.setEmploye(employe);
        h.setDate(LocalDateTime.now());
        historiqueRepository.save(h);
    }
}
