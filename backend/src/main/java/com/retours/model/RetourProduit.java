package com.retours.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;

// @Entity = cette classe Java correspond à une table dans MySQL
// Hibernate va créer automatiquement la table "retour_produit"
@Entity
public class RetourProduit {

    // @Id = clé primaire de la table
    // @GeneratedValue = la valeur est générée automatiquement (AUTO_INCREMENT en MySQL)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NotBlank = ce champ ne peut pas être vide
    // Spring va vérifier ça avant d'enregistrer
    @NotBlank(message = "Le produit est obligatoire")
    private String produit;

    @NotBlank(message = "Le client est obligatoire")
    private String client;

    private String emailClient;

    @NotBlank(message = "La raison est obligatoire")
    private String raison;

    // L'état du retour : EN_ATTENTE, EN_COURS, VALIDE, REJETE, REMBOURSE
    private String etatTraitement = "EN_ATTENTE";

    // La date du retour
    private LocalDate date;

    // @Min = la quantité doit être au minimum 1
    @Min(value = 1, message = "La quantité doit être au moins 1")
    private int quantite = 1;

    private String commentaire;

    // @PrePersist = cette méthode est appelée automatiquement avant chaque INSERT en base
    // Si la date n'est pas fournie, on met la date d'aujourd'hui
    @PrePersist
    public void avantSauvegarde() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }

    // ============ GETTERS ET SETTERS ============
    // Les getters permettent de LIRE une valeur
    // Les setters permettent d'ÉCRIRE une valeur
    // Spring a besoin de ces méthodes pour convertir le JSON en objet Java

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProduit() { return produit; }
    public void setProduit(String produit) { this.produit = produit; }

    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }

    public String getEmailClient() { return emailClient; }
    public void setEmailClient(String emailClient) { this.emailClient = emailClient; }

    public String getRaison() { return raison; }
    public void setRaison(String raison) { this.raison = raison; }

    public String getEtatTraitement() { return etatTraitement; }
    public void setEtatTraitement(String etatTraitement) { this.etatTraitement = etatTraitement; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public String getCommentaire() { return commentaire; }
    public void setCommentaire(String commentaire) { this.commentaire = commentaire; }
}
