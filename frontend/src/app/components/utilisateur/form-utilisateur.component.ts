import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UtilisateurService } from '../../services/services';
import { Utilisateur, ROLES } from '../../models/models';

@Component({
  selector: 'app-form-utilisateur',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div>
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/utilisateurs" class="btn btn-sm btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i>
        </a>
        <h4 class="fw-bold mb-0">
          <i class="bi bi-person-plus me-2 text-success"></i>
          {{ modeEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
        </h4>
      </div>

      <div *ngIf="erreur" class="alert alert-danger mb-3">{{ erreur }}</div>

      <div class="form-box" style="max-width:480px;">
        <form #f="ngForm" (ngSubmit)="sauvegarder(f)">
          <div class="row g-3">

            <div class="col-12">
              <label class="form-label fw-semibold">Nom complet <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     name="nom" [(ngModel)]="utilisateur.nom" required minlength="2" #nom="ngModel"
                     placeholder="Prénom Nom">
              <div *ngIf="nom.invalid && nom.touched" class="text-danger small mt-1">
                Nom obligatoire (min. 2 caractères).
              </div>
            </div>

            <div class="col-12">
              <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
              <input type="email" class="form-control"
                     name="email" [(ngModel)]="utilisateur.email" required email #email="ngModel"
                     [disabled]="modeEdit"
                     placeholder="exemple@email.com">
              <div *ngIf="email.invalid && email.touched" class="text-danger small mt-1">Email valide obligatoire.</div>
              <div *ngIf="modeEdit" class="form-text">L'email ne peut pas être modifié.</div>
            </div>

            <div class="col-12">
              <label class="form-label fw-semibold">Rôle <span class="text-danger">*</span></label>
              <select class="form-select" name="role" [(ngModel)]="utilisateur.role" required>
                <option value="">-- Choisir un rôle --</option>
                <option *ngFor="let r of roles" [value]="r.valeur">{{ r.libelle }}</option>
              </select>
            </div>

            <!-- Explication des rôles -->
            <div class="col-12">
              <div class="bg-light rounded p-3 small">
                <strong>Rôles disponibles :</strong>
                <ul class="mb-0 mt-1 ps-3">
                  <li><strong>ADMIN</strong> : accès complet au système</li>
                  <li><strong>AGENT_SAV</strong> : gère et suit les retours clients</li>
                  <li><strong>QUALITE</strong> : traite les non-conformités</li>
                </ul>
              </div>
            </div>

          </div>

          <div class="d-flex gap-2 mt-4 pt-3 border-top">
            <button type="submit" class="btn btn-success px-4" [disabled]="f.invalid || enCours">
              <span *ngIf="enCours" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!enCours" class="bi bi-check-circle me-2"></i>
              {{ modeEdit ? 'Enregistrer' : 'Créer' }}
            </button>
            <a routerLink="/utilisateurs" class="btn btn-outline-secondary px-4">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormUtilisateurComponent implements OnInit {

  utilisateur: Utilisateur = { nom: '', email: '', role: '' };
  modeEdit = false;
  userId: number | null = null;
  enCours = false;
  erreur = '';
  roles = ROLES;

  constructor(
    private service: UtilisateurService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modeEdit = true;
      this.userId = +id;
      this.service.getById(this.userId).subscribe({
        next: (data) => this.utilisateur = data,
        error: () => this.erreur = 'Impossible de charger l\'utilisateur.'
      });
    }
  }

  sauvegarder(form: any): void {
    if (form.invalid) return;
    this.enCours = true;
    const appel = this.modeEdit && this.userId
      ? this.service.update(this.userId, this.utilisateur)
      : this.service.create(this.utilisateur);

    appel.subscribe({
      next: () => this.router.navigate(['/utilisateurs']),
      error: (err) => {
        this.erreur = err.error?.erreur || 'Erreur lors de la sauvegarde.';
        this.enCours = false;
      }
    });
  }
}
