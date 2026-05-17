import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RetourService } from '../../services/services';
import { RetourProduit, ETATS_RETOUR } from '../../models/models';

@Component({
  selector: 'app-form-retour',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div>
      <!-- En-tête -->
      <div class="d-flex align-items-center mb-4">
        <a routerLink="/retours" class="btn btn-sm btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i>
        </a>
        <h4 class="fw-bold mb-0">
          <i class="bi bi-{{ modeEdit ? 'pencil' : 'plus-circle' }} me-2 text-primary"></i>
          {{ modeEdit ? 'Modifier le retour' : 'Nouveau retour produit' }}
        </h4>
      </div>

      <div *ngIf="erreur" class="alert alert-danger mb-3">{{ erreur }}</div>

      <div class="form-box" style="max-width:700px;">
        <!-- ngForm = formulaire Angular. #f="ngForm" donne accès à l'état du formulaire -->
        <form #f="ngForm" (ngSubmit)="sauvegarder(f)">
          <div class="row g-3">

            <!-- Produit -->
            <div class="col-md-6">
              <label class="form-label fw-semibold">Produit <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     name="produit" [(ngModel)]="retour.produit"
                     required minlength="2" #produit="ngModel"
                     placeholder="Ex : Samsung Galaxy A54">
              <!-- Afficher l'erreur seulement si l'utilisateur a touché le champ -->
              <div *ngIf="produit.invalid && produit.touched" class="text-danger small mt-1">
                Le produit est obligatoire (min. 2 caractères).
              </div>
            </div>

            <!-- Client -->
            <div class="col-md-6">
              <label class="form-label fw-semibold">Client <span class="text-danger">*</span></label>
              <input type="text" class="form-control"
                     name="client" [(ngModel)]="retour.client"
                     required #client="ngModel"
                     placeholder="Ex : Ahmed Ben Ali">
              <div *ngIf="client.invalid && client.touched" class="text-danger small mt-1">
                Le nom du client est obligatoire.
              </div>
            </div>

            <!-- Email -->
            <div class="col-md-6">
              <label class="form-label fw-semibold">Email du client</label>
              <input type="email" class="form-control"
                     name="emailClient" [(ngModel)]="retour.emailClient"
                     placeholder="client@email.com">
            </div>

            <!-- Quantité -->
            <div class="col-md-3">
              <label class="form-label fw-semibold">Quantité <span class="text-danger">*</span></label>
              <input type="number" class="form-control"
                     name="quantite" [(ngModel)]="retour.quantite"
                     required min="1">
            </div>

            <!-- État (seulement en mode modification) -->
            <div class="col-md-3" *ngIf="modeEdit">
              <label class="form-label fw-semibold">État</label>
              <select class="form-select" name="etatTraitement" [(ngModel)]="retour.etatTraitement">
                <option *ngFor="let e of etats" [value]="e.valeur">{{ e.libelle }}</option>
              </select>
            </div>

            <!-- Raison -->
            <div class="col-12">
              <label class="form-label fw-semibold">Raison du retour <span class="text-danger">*</span></label>
              <textarea class="form-control" rows="3"
                        name="raison" [(ngModel)]="retour.raison"
                        required #raison="ngModel"
                        placeholder="Décrivez la raison du retour..."></textarea>
              <div *ngIf="raison.invalid && raison.touched" class="text-danger small mt-1">
                La raison est obligatoire.
              </div>
            </div>

            <!-- Commentaire -->
            <div class="col-12">
              <label class="form-label fw-semibold">Commentaire (optionnel)</label>
              <textarea class="form-control" rows="2"
                        name="commentaire" [(ngModel)]="retour.commentaire"
                        placeholder="Notes supplémentaires..."></textarea>
            </div>

          </div>

          <!-- Boutons -->
          <div class="d-flex gap-2 mt-4 pt-3 border-top">
            <!-- f.invalid = le formulaire contient des erreurs -->
            <button type="submit" class="btn btn-primary px-4" [disabled]="f.invalid || enCours">
              <span *ngIf="enCours" class="spinner-border spinner-border-sm me-2"></span>
              <i *ngIf="!enCours" class="bi bi-check-circle me-2"></i>
              {{ modeEdit ? 'Enregistrer' : 'Créer le retour' }}
            </button>
            <a routerLink="/retours" class="btn btn-outline-secondary px-4">Annuler</a>
          </div>

        </form>
      </div>
    </div>
  `
})
export class FormRetourComponent implements OnInit {

  // Objet retour lié au formulaire via [(ngModel)]
  retour: RetourProduit = {
    produit: '', client: '', raison: '',
    etatTraitement: 'EN_ATTENTE', quantite: 1
  };

  modeEdit = false;   // false = création, true = modification
  retourId: number | null = null;
  enCours = false;
  erreur = '';
  etats = ETATS_RETOUR;

  constructor(
    private service: RetourService,
    private router: Router,
    private route: ActivatedRoute  // permet de lire les paramètres de l'URL
  ) {}

  ngOnInit(): void {
    // Lire le paramètre :id dans l'URL (ex: /retours/5/edit)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modeEdit = true;
      this.retourId = +id; // '+' convertit string → number
      // Charger le retour existant pour préremplir le formulaire
      this.service.getById(this.retourId).subscribe({
        next: (data) => this.retour = data,
        error: () => this.erreur = 'Impossible de charger le retour.'
      });
    }
  }

  sauvegarder(form: any): void {
    if (form.invalid) return;
    this.enCours = true;
    this.erreur = '';

    // Choisir create ou update selon le mode
    const appel = this.modeEdit && this.retourId
      ? this.service.update(this.retourId, this.retour)
      : this.service.create(this.retour);

    appel.subscribe({
      next: () => this.router.navigate(['/retours']), // rediriger vers la liste
      error: (err) => {
        this.erreur = err.error?.erreur || 'Erreur lors de la sauvegarde.';
        this.enCours = false;
      }
    });
  }
}
