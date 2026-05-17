// Définit quelle URL affiche quel composant
import { Routes } from '@angular/router';
import { DashboardComponent }         from './components/dashboard/dashboard.component';
import { ListeRetoursComponent }       from './components/retour/liste-retours.component';
import { FormRetourComponent }         from './components/retour/form-retour.component';
import { DetailRetourComponent }       from './components/retour/detail-retour.component';
import { ListeNCComponent }            from './components/nonconformite/liste-nc.component';
import { FormNCComponent }             from './components/nonconformite/form-nc.component';
import { ListeUtilisateursComponent }  from './components/utilisateur/liste-utilisateurs.component';
import { FormUtilisateurComponent }    from './components/utilisateur/form-utilisateur.component';

export const routes: Routes = [
  { path: '',              redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard',     component: DashboardComponent },

  { path: 'retours',             component: ListeRetoursComponent },
  { path: 'retours/nouveau',     component: FormRetourComponent },
  { path: 'retours/:id',         component: DetailRetourComponent },
  { path: 'retours/:id/edit',    component: FormRetourComponent },

  { path: 'non-conformites',           component: ListeNCComponent },
  { path: 'non-conformites/nouveau',   component: FormNCComponent },
  { path: 'non-conformites/:id/edit',  component: FormNCComponent },

  { path: 'utilisateurs',          component: ListeUtilisateursComponent },
  { path: 'utilisateurs/nouveau',  component: FormUtilisateurComponent },
  { path: 'utilisateurs/:id/edit', component: FormUtilisateurComponent },

  { path: '**', redirectTo: 'dashboard' }
];
