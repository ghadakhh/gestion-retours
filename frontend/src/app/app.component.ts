// Composant racine : affiche la sidebar + le contenu des pages
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex">

      <!-- ── BARRE LATÉRALE ── -->
      <nav class="sidebar d-flex flex-column py-3">

        <div class="text-white text-center mb-3 px-2">
          <i class="bi bi-arrow-return-left fs-4 text-primary"></i>
          <div class="fw-bold small mt-1">Gestion Retours</div>
        </div>

        <ul class="nav flex-column">
          <li class="nav-item">
            <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
              <i class="bi bi-speedometer2 me-2"></i>Tableau de bord
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/retours" routerLinkActive="active">
              <i class="bi bi-arrow-return-left me-2"></i>Retours Produits
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/non-conformites" routerLinkActive="active">
              <i class="bi bi-exclamation-triangle me-2"></i>Non-Conformités
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="/utilisateurs" routerLinkActive="active">
              <i class="bi bi-people me-2"></i>Utilisateurs
            </a>
          </li>
        </ul>

      </nav>

      <!-- ── CONTENU PRINCIPAL ── -->
      <div class="flex-grow-1">

        <!-- Barre du haut -->
        <div class="bg-white px-4 py-2 shadow-sm d-flex align-items-center justify-content-between">
          <span class="text-muted small">Système de Gestion des Retours — Sujet 6</span>
          <span class="badge bg-success"><i class="bi bi-circle-fill me-1" style="font-size:0.5rem"></i>En ligne</span>
        </div>

        <!-- Zone de contenu : router-outlet affiche le composant de la route active -->
        <div class="p-4">
          <router-outlet></router-outlet>
        </div>

      </div>
    </div>
  `
})
export class AppComponent {}
