package com.retours.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// @Entity = Hibernate crée automatiquement la table "utilisateur" dans MySQL
@Entity
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    // @Email = vérifie que le format est bien un email (ex: a@b.com)
    // @Column(unique=true) = deux utilisateurs ne peuvent pas avoir le même email
    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    @Column(unique = true)
    private String email;

    // Rôle : ADMIN, AGENT_SAV, QUALITE
    @NotBlank(message = "Le rôle est obligatoire")
    private String role;

    // ============ GETTERS ET SETTERS ============

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
