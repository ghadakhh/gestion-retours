import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../services/services';
import { Utilisateur, ROLES } from '../../models/models';

@Component({
  selector: 'app-liste-utilisateurs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">
          <i class="bi bi-people me-2 text-success"></i>Utilisateurs
          <span class="badge bg-secondary ms-2 fs-6">{{ liste.length }}</span>
        </h4>
        <a routerLink="/utilisateurs/nouveau" class="btn btn-success">
          <i class="bi bi-person-plus me-1"></i>Nouveau
        </a>
      </div>

      <div *ngIf="message" class="alert {{ msgType }} alert-dismissible mb-3">
        {{ message }}<button type="button" class="btn-close" (click)="message=''"></button>
      </div>

      <div *ngIf="chargement" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
      </div>

      <!-- Affichage en cartes -->
      <div *ngIf="!chargement" class="row g-3">
        <div *ngFor="let u of liste" class="col-12 col-sm-6 col-xl-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <!-- Avatar avec initiale -->
              <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                   style="width:46px;height:46px;font-size:1.1rem;min-width:46px;">
                {{ u.nom.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold">{{ u.nom }}</div>
                <div class="text-muted small">{{ u.email }}</div>
                <span class="badge {{ getBadgeRole(u.role) }} rounded-pill mt-1">{{ getLibelleRole(u.role) }}</span>
              </div>
              <div class="d-flex gap-1">
                <a [routerLink]="['/utilisateurs', u.id, 'edit']" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-pencil"></i>
                </a>
                <button class="btn btn-sm btn-outline-danger" (click)="supprimer(u)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="liste.length === 0" class="col-12 text-center text-muted py-4">
          <i class="bi bi-people d-block fs-3 mb-2"></i>Aucun utilisateur
        </div>
      </div>
    </div>
  `
})
export class ListeUtilisateursComponent implements OnInit {

  liste: Utilisateur[] = [];
  chargement = true;
  message = '';
  msgType = 'alert-success';

  constructor(private service: UtilisateurService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => { this.liste = data; this.chargement = false; },
      error: () => { this.afficher('Erreur de chargement.', 'alert-danger'); this.chargement = false; }
    });
  }

  supprimer(u: Utilisateur): void {
    if (!confirm(`Supprimer l'utilisateur ${u.nom} ?`)) return;
    this.service.delete(u.id!).subscribe({
      next: () => {
        this.liste = this.liste.filter(x => x.id !== u.id);
        this.afficher('Utilisateur supprimé.', 'alert-success');
      }
    });
  }

  getBadgeRole(role: string): string {
    const map: Record<string, string> = { 'ADMIN': 'bg-danger', 'AGENT_SAV': 'bg-info text-dark', 'QUALITE': 'bg-success' };
    return map[role] || 'bg-secondary';
  }

  getLibelleRole(role: string): string {
    return ROLES.find(r => r.valeur === role)?.libelle || role;
  }

  afficher(msg: string, type: string): void {
    this.message = msg; this.msgType = type;
    setTimeout(() => this.message = '', 4000);
  }
}
