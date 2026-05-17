package com.retours.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

// @Entity = Hibernate crée la table "historique_retour" dans MySQL
// Cette table sert à tracer toutes les actions faites sur un retour
// (ex: "Ahmed a changé le statut de EN_ATTENTE à EN_COURS le 15/01/2024")
@Entity
public class HistoriqueRetour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // L'ID du retour concerné par cette action
    @NotNull(message = "L'ID du retour est obligatoire")
    private Long retourId;

    // Description de ce qui a été fait
    @NotBlank(message = "L'action est obligatoire")
    private String action;

    // Qui a fait l'action
    @NotBlank(message = "L'employé est obligatoire")
    private String employe;

    // Quand l'action a été faite (date + heure)
    private LocalDateTime date;

    private String commentaire;

    @PrePersist
    public void avantSauvegarde() {
        if (this.date == null) {
            this.date = LocalDateTime.now();
        }
    }

    // ============ GETTERS ET SETTERS ============

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRetourId() { return retourId; }
    public void setRetourId(Long retourId) { this.retourId = retourId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEmploye() { return employe; }
    public void setEmploye(String employe) { this.employe = employe; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }
}
