import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NonConformiteService } from '../../services/services';
import { NonConformite, GRAVITES } from '../../models/models';

@Component({
  selector: 'app-form-nc',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div>
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/non-conformites" class="btn btn-sm btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i>
        </a>
        <h4 class="fw-bold mb-0">
          <i class="bi bi-exclamation-triangle me-2 text-warning"></i>
          {{ modeEdit ? 'Modifier la non-conformité' : 'Nouvelle non-conformité' }}
        </h4>
      </div>

      <div *ngIf="erreur" class="alert alert-danger mb-3">{{ erreur }}</div>

      <div class="form-box" style="max-width:650px;">
        <form #f="ngForm" (ngSubmit)="sauvegarder(f)">
          <div class="row g-3">

            <div class="col-md-6">
              <label class="form-label fw-semibold">Produit <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     name="produit" [(ngModel)]="nc.produit" required #produit="ngModel"
                     placeholder="Nom du produit non-conforme">
              <div *ngIf="produit.invalid && produit.touched" class="text-danger small mt-1">Obligatoire.</div>
            </div>

            <div class="col-md-3">
              <label class="form-label fw-semibold">Gravité <span class="text-danger">*</span></label>
              <select class="form-select" name="gravite" [(ngModel)]="nc.gravite" required>
                <option value="">-- Choisir --</option>
                <option *ngFor="let g of gravites" [value]="g.valeur">{{ g.libelle }}</option>
              </select>
            </div>

            <div class="col-md-3" *ngIf="modeEdit">
              <label class="form-label fw-semibold">Statut</label>
              <select class="form-select" name="statut" [(ngModel)]="nc.statut">
                <option value="OUVERTE">Ouverte</option>
                <option value="EN_COURS">En cours</option>
                <option value="RESOLUE">Résolue</option>
                <option value="FERMEE">Fermée</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-semibold">ID Retour associé (optionnel)</label>
              <input type="number" class="form-control" name="retourId" [(ngModel)]="nc.retourId"
                     placeholder="Laisser vide si non lié à un retour">
            </div>

            <div class="col-12">
              <label class="form-label fw-semibold">Description <span class="text-danger">*</span></label>
              <textarea class="form-control" rows="4"
                        name="description" [(ngModel)]="nc.description" required #desc="ngModel"
                        placeholder="Décrivez le problème de non-conformité..."></textarea>
              <div *ngIf="desc.invalid && desc.touched" class="text-danger small mt-1">Obligatoire.</div>
            </div>

            <div class="col-12" *ngIf="modeEdit">
              <label class="form-label fw-semibold">Actions correctives</label>
              <textarea class="form-control" rows="3"
                        name="actionsCorrectives" [(ngModel)]="nc.actionsCorrectives"
                        placeholder="Actions prises pour corriger le problème..."></textarea>
            </div>

          </div>

          <div class="d-flex gap-2 mt-4 pt-3 border-top">
            <button type="submit" class="btn btn-warning px-4" [disabled]="f.invalid || enCours">
              <span *ngIf="enCours" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!enCours" class="bi bi-check-circle me-2"></i>
              {{ modeEdit ? 'Enregistrer' : 'Créer' }}
            </button>
            <a routerLink="/non-conformites" class="btn btn-outline-secondary px-4">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormNCComponent implements OnInit {

  nc: NonConformite = { description: '', gravite: '', produit: '', statut: 'OUVERTE' };
  modeEdit = false;
  ncId: number | null = null;
  enCours = false;
  erreur = '';
  gravites = GRAVITES;

  constructor(
    private service: NonConformiteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modeEdit = true;
      this.ncId = +id;
      this.service.getById(this.ncId).subscribe({
        next: (data) => this.nc = data,
        error: () => this.erreur = 'Impossible de charger la non-conformité.'
      });
    }
  }

  sauvegarder(form: any): void {
    if (form.invalid) return;
    this.enCours = true;
    const appel = this.modeEdit && this.ncId
      ? this.service.update(this.ncId, this.nc)
      : this.service.create(this.nc);

    appel.subscribe({
      next: () => this.router.navigate(['/non-conformites']),
      error: () => { this.erreur = 'Erreur lors de la sauvegarde.'; this.enCours = false; }
    });
  }
}
