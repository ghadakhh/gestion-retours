import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RetourService, HistoriqueService } from '../../services/services';
import { RetourProduit, HistoriqueRetour, ETATS_RETOUR } from '../../models/models';

@Component({
  selector: 'app-detail-retour',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div>
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/retours" class="btn btn-sm btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i>
        </a>
        <h4 class="fw-bold mb-0">
          <i class="bi bi-file-text me-2 text-primary"></i>Détail Retour #{{ retour?.id }}
        </h4>
        <a *ngIf="retour" [routerLink]="['/retours', retour.id, 'edit']"
           class="btn btn-outline-primary btn-sm ms-auto">
          <i class="bi bi-pencil me-1"></i>Modifier
        </a>
      </div>

      <div *ngIf="chargement" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div *ngIf="!chargement && retour" class="row g-3">

        <!-- Informations -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white"><h6 class="fw-bold mb-0">Informations du retour</h6></div>
            <div class="card-body">
              <table class="table table-borderless mb-0">
                <tbody>
                  <tr><td class="text-muted fw-semibold" style="width:40%">Produit</td><td class="fw-bold">{{ retour.produit }}</td></tr>
                  <tr><td class="text-muted fw-semibold">Client</td><td>{{ retour.client }}</td></tr>
                  <tr *ngIf="retour.emailClient"><td class="text-muted fw-semibold">Email</td><td>{{ retour.emailClient }}</td></tr>
                  <tr><td class="text-muted fw-semibold">Quantité</td><td>{{ retour.quantite }}</td></tr>
                  <tr><td class="text-muted fw-semibold">Date</td><td>{{ retour.date }}</td></tr>
                  <tr><td class="text-muted fw-semibold">Raison</td><td>{{ retour.raison }}</td></tr>
                  <tr *ngIf="retour.commentaire"><td class="text-muted fw-semibold">Commentaire</td><td>{{ retour.commentaire }}</td></tr>
                  <tr>
                    <td class="text-muted fw-semibold">État actuel</td>
                    <td>
                      <span class="badge rounded-pill {{ getBadge(retour.etatTraitement) }} px-3 py-2">
                        {{ getLibelle(retour.etatTraitement) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Changer état -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white"><h6 class="fw-bold mb-0">Changer l'état</h6></div>
            <div class="card-body">
              <div *ngIf="msgAction" class="alert alert-success small py-2 mb-3">{{ msgAction }}</div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Nouvel état</label>
                <select class="form-select" [(ngModel)]="nouvelEtat">
                  <option *ngFor="let e of etats" [value]="e.valeur">{{ e.libelle }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Votre nom</label>
                <input type="text" class="form-control" [(ngModel)]="employe" placeholder="Ex : Marie Dupont">
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Commentaire</label>
                <textarea class="form-control" rows="2" [(ngModel)]="commentaire" placeholder="Optionnel..."></textarea>
              </div>
              <button class="btn btn-primary w-100" (click)="changerEtat()" [disabled]="!employe">
                <i class="bi bi-check-circle me-1"></i>Appliquer le changement
              </button>
            </div>
          </div>
        </div>

        <!-- Historique -->
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white">
              <h6 class="fw-bold mb-0">
                <i class="bi bi-clock-history me-2 text-primary"></i>Historique
              </h6>
            </div>
            <div class="card-body">
              <div *ngIf="historique.length === 0" class="text-center text-muted py-3">
                Aucun historique.
              </div>
              <div *ngFor="let h of historique; let i = index"
                   class="d-flex pb-3 mb-3" [class.border-bottom]="i < historique.length - 1">
                <div class="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                     style="width:32px;height:32px;min-width:32px;font-size:0.75rem;">
                  <i class="bi bi-activity"></i>
                </div>
                <div>
                  <div class="fw-semibold small">{{ h.action }}</div>
                  <div class="text-muted" style="font-size:0.8rem;">
                    Par <strong>{{ h.employe }}</strong> — {{ h.date | date:'dd/MM/yyyy HH:mm' }}
                  </div>
                  <div *ngIf="h.commentaire" class="text-muted fst-italic small">{{ h.commentaire }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class DetailRetourComponent implements OnInit {

  retour: RetourProduit | null = null;
  historique: HistoriqueRetour[] = [];
  chargement = true;
  etats = ETATS_RETOUR;
  nouvelEtat = '';
  employe = '';
  commentaire = '';
  msgAction = '';

  constructor(
    private retourService: RetourService,
    private historiqueService: HistoriqueService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.retourService.getById(id).subscribe({
      next: (data) => {
        this.retour = data;
        this.nouvelEtat = data.etatTraitement;
        this.chargement = false;
        this.historiqueService.getParRetour(id).subscribe(h => this.historique = h);
      },
      error: () => this.chargement = false
    });
  }

  changerEtat(): void {
    if (!this.retour?.id) return;
    this.retourService.changerEtat(this.retour.id, this.nouvelEtat, this.employe, this.commentaire).subscribe({
      next: (data) => {
        this.retour = data;
        this.msgAction = 'État mis à jour avec succès !';
        this.commentaire = '';
        this.historiqueService.getParRetour(data.id!).subscribe(h => this.historique = h);
        setTimeout(() => this.msgAction = '', 3000);
      }
    });
  }

  getBadge(etat: string): string {
    return ETATS_RETOUR.find(e => e.valeur === etat)?.badge || 'bg-secondary';
  }

  getLibelle(etat: string): string {
    return ETATS_RETOUR.find(e => e.valeur === etat)?.libelle || etat;
  }
}