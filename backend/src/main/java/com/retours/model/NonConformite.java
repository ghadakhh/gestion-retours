package com.retours.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

// @Entity = Hibernate crée automatiquement la table "non_conformite" dans MySQL
@Entity
public class NonConformite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    // Gravité : FAIBLE, MOYENNE, ELEVEE, CRITIQUE
    @NotBlank(message = "La gravité est obligatoire")
    private String gravite;

    private LocalDate date;

    @NotBlank(message = "Le produit est obligatoire")
    private String produit;

    // Statut : OUVERTE, EN_COURS, RESOLUE, FERMEE
    private String statut = "OUVERTE";

    // Actions prises pour corriger le problème
    private String actionsCorrectives;

    // Si la NC est liée à un retour, on stocke l'ID du retour ici
    private Long retourId;

    @PrePersist
    public void avantSauvegarde() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }

    // ============ GETTERS ET SETTERS ============

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGravite() { return gravite; }
    public void setGravite(String gravite) { this.gravite = gravite; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getProduit() { return produit; }
    public void setProduit(String produit) { this.produit = produit; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getActionsCorrectives() { return actionsCorrectives; }
    public void setActionsCorrectives(String actionsCorrectives) { this.actionsCorrectives = actionsCorrectives; }

    public Long getRetourId() { return retourId; }
    public void setRetourId(Long retourId) { this.retourId = retourId; }
}
