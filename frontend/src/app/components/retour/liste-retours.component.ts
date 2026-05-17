import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RetourService } from '../../services/services';
import { RetourProduit, ETATS_RETOUR } from '../../models/models';

@Component({
  selector: 'app-liste-retours',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div>
      <!-- En-tête -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold mb-0">
          <i class="bi bi-arrow-return-left me-2 text-primary"></i>Retours Produits
          <span class="badge bg-secondary ms-2 fs-6">{{ liste.length }}</span>
        </h4>
        <a routerLink="/retours/nouveau" class="btn btn-primary">
          <i class="bi bi-plus-circle me-1"></i>Nouveau
        </a>
      </div>

      <!-- Message succès/erreur -->
      <div *ngIf="message" class="alert {{ msgType }} alert-dismissible mb-3">
        {{ message }}
        <button type="button" class="btn-close" (click)="message=''"></button>
      </div>

      <!-- Filtre -->
      <div class="card border-0 shadow-sm mb-3">
        <div class="card-body py-2 d-flex flex-wrap gap-2 align-items-center">
          <select class="form-select form-select-sm" style="width:auto" [(ngModel)]="filtreEtat" (change)="filtrer()">
            <option value="">Tous les états</option>
            <option *ngFor="let e of etats" [value]="e.valeur">{{ e.libelle }}</option>
          </select>
          <input type="text" class="form-control form-control-sm" style="width:250px"
                 placeholder="Rechercher client ou produit..."
                 [(ngModel)]="filtreTexte" (input)="filtrer()">
          <button class="btn btn-sm btn-outline-secondary" (click)="resetFiltres()">
            <i class="bi bi-x-circle"></i> Réinitialiser
          </button>
        </div>
      </div>

      <!-- Tableau -->
      <div class="table-box">
        <div *ngIf="chargement" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div *ngIf="!chargement" class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Produit</th>
                <th>Client</th>
                <th>Qté</th>
                <th>État</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of listeFiltree">
                <td class="text-muted small">{{ r.id }}</td>
                <td class="fw-semibold">{{ r.produit }}</td>
                <td>{{ r.client }}</td>
                <td>{{ r.quantite }}</td>
                <td>
                  <span class="badge rounded-pill {{ getBadge(r.etatTraitement) }}">
                    {{ getLibelle(r.etatTraitement) }}
                  </span>
                </td>
                <td class="text-muted small">{{ r.date }}</td>
                <td>
                  <div class="d-flex gap-1">
                    <a [routerLink]="['/retours', r.id]" class="btn btn-sm btn-outline-info" title="Détail">
                      <i class="bi bi-eye"></i>
                    </a>
                    <a [routerLink]="['/retours', r.id, 'edit']" class="btn btn-sm btn-outline-primary" title="Modifier">
                      <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger" (click)="supprimer(r)" title="Supprimer">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="listeFiltree.length === 0">
                <td colspan="7" class="text-center text-muted py-4">
                  <i class="bi bi-inbox d-block fs-3 mb-2"></i>Aucun retour trouvé
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ListeRetoursComponent implements OnInit {

  liste: RetourProduit[] = [];
  listeFiltree: RetourProduit[] = [];
  chargement = true;
  filtreEtat = '';
  filtreTexte = '';
  message = '';
  msgType = 'alert-success';
  etats = ETATS_RETOUR;

  constructor(private service: RetourService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    // subscribe() = exécute la requête HTTP et récupère le résultat
    this.service.getAll().subscribe({
      next: (data) => {
        this.liste = data;
        this.listeFiltree = data;
        this.chargement = false;
      },
      error: () => {
        this.afficherMessage('Erreur de chargement.', 'alert-danger');
        this.chargement = false;
      }
    });
  }

  filtrer(): void {
    this.listeFiltree = this.liste.filter(r => {
      const okEtat = !this.filtreEtat || r.etatTraitement === this.filtreEtat;
      const okTexte = !this.filtreTexte ||
        r.client.toLowerCase().includes(this.filtreTexte.toLowerCase()) ||
        r.produit.toLowerCase().includes(this.filtreTexte.toLowerCase());
      return okEtat && okTexte;
    });
  }

  resetFiltres(): void {
    this.filtreEtat = '';
    this.filtreTexte = '';
    this.listeFiltree = this.liste;
  }

  supprimer(r: RetourProduit): void {
    // confirm() affiche une boîte de dialogue de confirmation native du navigateur
    if (!confirm(`Supprimer le retour de ${r.client} pour ${r.produit} ?`)) return;

    this.service.delete(r.id!).subscribe({
      next: () => {
        this.liste = this.liste.filter(x => x.id !== r.id);
        this.filtrer();
        this.afficherMessage('Retour supprimé avec succès.', 'alert-success');
      },
      error: () => this.afficherMessage('Erreur lors de la suppression.', 'alert-danger')
    });
  }

  getBadge(etat: string): string {
    return ETATS_RETOUR.find(e => e.valeur === etat)?.badge || 'bg-secondary';
  }

  getLibelle(etat: string): string {
    return ETATS_RETOUR.find(e => e.valeur === etat)?.libelle || etat;
  }

  afficherMessage(msg: string, type: string): void {
    this.message = msg;
    this.msgType = type;
    setTimeout(() => this.message = '', 4000); // efface le message après 4 secondes
  }
}
