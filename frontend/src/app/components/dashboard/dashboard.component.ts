import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RetourService, NonConformiteService, UtilisateurService } from '../../services/services';
import { RetourProduit, ETATS_RETOUR } from '../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <!-- Titre -->
      <h4 class="fw-bold mb-4">
        <i class="bi bi-speedometer2 me-2 text-primary"></i>Tableau de bord
      </h4>

      <!-- ── CARTES STATISTIQUES ── -->
      <div class="row g-3 mb-4">

        <div class="col-6 col-xl-3">
          <div class="card card-stat h-100" style="border-left:4px solid #0d6efd">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small">Total Retours</div>
                <h3 class="fw-bold mb-0">{{ totalRetours }}</h3>
              </div>
              <i class="bi bi-arrow-return-left fs-2 text-primary opacity-50"></i>
            </div>
          </div>
        </div>

        <div class="col-6 col-xl-3">
          <div class="card card-stat h-100" style="border-left:4px solid #ffc107">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small">En Attente</div>
                <h3 class="fw-bold mb-0">{{ enAttente }}</h3>
              </div>
              <i class="bi bi-hourglass-split fs-2 text-warning opacity-50"></i>
            </div>
          </div>
        </div>

        <div class="col-6 col-xl-3">
          <div class="card card-stat h-100" style="border-left:4px solid #dc3545">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small">Non-Conformités</div>
                <h3 class="fw-bold mb-0">{{ totalNC }}</h3>
              </div>
              <i class="bi bi-exclamation-triangle fs-2 text-danger opacity-50"></i>
            </div>
          </div>
        </div>

        <div class="col-6 col-xl-3">
          <div class="card card-stat h-100" style="border-left:4px solid #198754">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <div class="text-muted small">Utilisateurs</div>
                <h3 class="fw-bold mb-0">{{ totalUsers }}</h3>
              </div>
              <i class="bi bi-people fs-2 text-success opacity-50"></i>
            </div>
          </div>
        </div>

      </div>

      <!-- ── DERNIERS RETOURS ── -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h6 class="fw-bold mb-0"><i class="bi bi-clock-history me-2 text-primary"></i>Derniers retours</h6>
          <a routerLink="/retours" class="btn btn-sm btn-outline-primary">Voir tout</a>
        </div>
        <div class="card-body p-0">
          <div *ngIf="chargement" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div *ngIf="!chargement" class="table-responsive">
            <table class="table table-hover mb-0">
              <thead><tr><th>Produit</th><th>Client</th><th>État</th><th>Date</th></tr></thead>
              <tbody>
                <tr *ngFor="let r of derniers">
                  <td class="fw-semibold">{{ r.produit }}</td>
                  <td>{{ r.client }}</td>
                  <td><span class="badge rounded-pill {{ getBadge(r.etatTraitement) }}">{{ getLibelle(r.etatTraitement) }}</span></td>
                  <td class="text-muted small">{{ r.date }}</td>
                </tr>
                <tr *ngIf="derniers.length === 0">
                  <td colspan="4" class="text-center text-muted py-3">Aucun retour</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── ACTIONS RAPIDES ── -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <h6 class="fw-bold mb-3">Actions rapides</h6>
          <div class="d-flex flex-wrap gap-2">
            <a routerLink="/retours/nouveau" class="btn btn-primary btn-sm">
              <i class="bi bi-plus-circle me-1"></i>Nouveau retour
            </a>
            <a routerLink="/non-conformites/nouveau" class="btn btn-warning btn-sm">
              <i class="bi bi-plus-circle me-1"></i>Nouvelle non-conformité
            </a>
            <a routerLink="/utilisateurs/nouveau" class="btn btn-success btn-sm">
              <i class="bi bi-plus-circle me-1"></i>Nouvel utilisateur
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {

  totalRetours = 0;
  totalNC = 0;
  totalUsers = 0;
  enAttente = 0;
  derniers: RetourProduit[] = [];
  chargement = true;

  constructor(
    private retourService: RetourService,
    private ncService: NonConformiteService,
    private userService: UtilisateurService
  ) {}

  // ngOnInit est appelé automatiquement quand le composant est affiché
  ngOnInit(): void {
    // Charger tous les retours
    this.retourService.getAll().subscribe(retours => {
      this.totalRetours = retours.length;
      this.enAttente = retours.filter(r => r.etatTraitement === 'EN_ATTENTE').length;
      this.derniers = retours.slice(0, 5); // 5 derniers
      this.chargement = false;
    });

    // Charger le total des non-conformités
    this.ncService.getTotal().subscribe(d => this.totalNC = d.total);

    // Charger le total des utilisateurs
    this.userService.getTotal().subscribe(d => this.totalUsers = d.total);
  }

  // Retourne la classe CSS du badge selon l'état
  getBadge(etat: string): string {
    return ETATS_RETOUR.find(e => e.valeur === etat)?.badge || 'bg-secondary';
  }

  // Retourne le libellé français de l'état
  getLibelle(etat: string): string {
    return ETATS_RETOUR.find(e => e.valeur === etat)?.libelle || etat;
  }
}
