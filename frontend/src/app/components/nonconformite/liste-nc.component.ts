import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NonConformiteService } from '../../services/services';
import { NonConformite, GRAVITES } from '../../models/models';

@Component({
  selector: 'app-liste-nc',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">
          <i class="bi bi-exclamation-triangle me-2 text-warning"></i>Non-Conformités
          <span class="badge bg-secondary ms-2 fs-6">{{ liste.length }}</span>
        </h4>
        <a routerLink="/non-conformites/nouveau" class="btn btn-warning">
          <i class="bi bi-plus-circle me-1"></i>Nouvelle
        </a>
      </div>

      <div *ngIf="message" class="alert {{ msgType }} alert-dismissible mb-3">
        {{ message }}<button type="button" class="btn-close" (click)="message=''"></button>
      </div>

      <!-- Filtre -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body py-2 d-flex flex-wrap gap-2 align-items-center">
          <select class="form-select form-select-sm" style="width:auto" [(ngModel)]="filtreGravite" (change)="filtrer()">
            <option value="">Toutes gravités</option>
            <option *ngFor="let g of gravites" [value]="g.valeur">{{ g.libelle }}</option>
          </select>
          <select class="form-select form-select-sm" style="width:auto" [(ngModel)]="filtreStatut" (change)="filtrer()">
            <option value="">Tous statuts</option>
            <option value="OUVERTE">Ouverte</option>
            <option value="EN_COURS">En cours</option>
            <option value="RESOLUE">Résolue</option>
            <option value="FERMEE">Fermée</option>
          </select>
          <button class="btn btn-sm btn-outline-secondary" (click)="reset()">
            <i class="bi bi-x-circle"></i>
          </button>
        </div>
      </div>

      <div class="table-box">
        <div *ngIf="chargement" class="text-center py-5">
          <div class="spinner-border text-warning" role="status"></div>
        </div>
        <div *ngIf="!chargement" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr><th>#</th><th>Produit</th><th>Description</th><th>Gravité</th><th>Statut</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let nc of listeFiltree">
                <td class="text-muted small">{{ nc.id }}</td>
                <td class="fw-semibold">{{ nc.produit }}</td>
                <td class="text-muted small" style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                  {{ nc.description }}
                </td>
                <td><span class="badge rounded-pill {{ getBadgeGravite(nc.gravite) }}">{{ nc.gravite }}</span></td>
                <td><span class="badge bg-secondary rounded-pill">{{ nc.statut }}</span></td>
                <td class="text-muted small">{{ nc.date }}</td>
                <td>
                  <div class="d-flex gap-1">
                    <a [routerLink]="['/non-conformites', nc.id, 'edit']" class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-success"
                            *ngIf="nc.statut !== 'RESOLUE' && nc.statut !== 'FERMEE'"
                            (click)="resoudre(nc)" title="Résoudre">
                      <i class="bi bi-check-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" (click)="supprimer(nc)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="listeFiltree.length === 0">
                <td colspan="7" class="text-center text-muted py-4">
                  <i class="bi bi-inbox d-block fs-3 mb-2"></i>Aucune non-conformité
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ListeNCComponent implements OnInit {

  liste: NonConformite[] = [];
  listeFiltree: NonConformite[] = [];
  chargement = true;
  filtreGravite = '';
  filtreStatut = '';
  message = '';
  msgType = 'alert-success';
  gravites = GRAVITES;

  constructor(private service: NonConformiteService) {}

  ngOnInit(): void { this.charger(); }

  charger(): void {
    this.chargement = true;
    this.service.getAll().subscribe({
      next: (data) => { this.liste = data; this.listeFiltree = data; this.chargement = false; },
      error: () => { this.afficher('Erreur de chargement.', 'alert-danger'); this.chargement = false; }
    });
  }

  filtrer(): void {
    this.listeFiltree = this.liste.filter(nc =>
      (!this.filtreGravite || nc.gravite === this.filtreGravite) &&
      (!this.filtreStatut  || nc.statut === this.filtreStatut)
    );
  }

  reset(): void { this.filtreGravite = ''; this.filtreStatut = ''; this.listeFiltree = this.liste; }

  resoudre(nc: NonConformite): void {
    const actions = prompt('Actions correctives prises :');
    if (actions === null) return;
    this.service.resoudre(nc.id!, actions).subscribe({
      next: (data) => {
        const i = this.liste.findIndex(n => n.id === nc.id);
        if (i !== -1) this.liste[i] = data;
        this.filtrer();
        this.afficher('Non-conformité résolue !', 'alert-success');
      }
    });
  }

  supprimer(nc: NonConformite): void {
    if (!confirm(`Supprimer la non-conformité sur "${nc.produit}" ?`)) return;
    this.service.delete(nc.id!).subscribe({
      next: () => {
        this.liste = this.liste.filter(n => n.id !== nc.id);
        this.filtrer();
        this.afficher('Supprimé.', 'alert-success');
      }
    });
  }

  getBadgeGravite(g: string): string {
    return GRAVITES.find(x => x.valeur === g)?.badge || 'bg-secondary';
  }

  afficher(msg: string, type: string): void {
    this.message = msg; this.msgType = type;
    setTimeout(() => this.message = '', 4000);
  }
}
