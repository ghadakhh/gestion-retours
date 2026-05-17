// ============================================================
// SERVICES ANGULAR
//
// Un service fait les appels HTTP vers le backend Spring Boot.
// Chaque méthode correspond à un endpoint de l'API REST.
//
// HttpClient est fourni par Angular pour faire des requêtes HTTP.
// Observable est un flux de données asynchrones (comme une promesse).
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RetourProduit, NonConformite, Utilisateur, HistoriqueRetour } from '../models/models';

// ─── SERVICE RETOUR PRODUIT ───────────────────────────────────────────────────
// providedIn: 'root' = ce service est disponible partout dans l'app (singleton)
@Injectable({ providedIn: 'root' })
export class RetourService {

private url = 'https://backend-327247053319.europe-west1.run.app/api/retours';

  constructor(private http: HttpClient) {}

  // GET /api/retours → retourne un tableau de RetourProduit
  getAll(): Observable<RetourProduit[]> {
    return this.http.get<RetourProduit[]>(this.url);
  }

  // GET /api/retours/{id}
  getById(id: number): Observable<RetourProduit> {
    return this.http.get<RetourProduit>(`${this.url}/${id}`);
  }

  // POST /api/retours → crée un retour
  create(retour: RetourProduit): Observable<RetourProduit> {
    return this.http.post<RetourProduit>(this.url, retour);
  }

  // PUT /api/retours/{id} → modifie un retour
  update(id: number, retour: RetourProduit): Observable<RetourProduit> {
    return this.http.put<RetourProduit>(`${this.url}/${id}`, retour);
  }

  // PATCH /api/retours/{id}/etat → change seulement l'état
  changerEtat(id: number, etat: string, employe: string, commentaire?: string): Observable<RetourProduit> {
    return this.http.patch<RetourProduit>(`${this.url}/${id}/etat`, { etat, employe, commentaire });
  }

  // DELETE /api/retours/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // GET /api/retours/stats/total
  getTotal(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.url}/stats/total`);
  }
}

// ─── SERVICE NON-CONFORMITÉ ───────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class NonConformiteService {


private url = 'https://backend-327247053319.europe-west1.run.app/api/non-conformites';

  constructor(private http: HttpClient) {}

  getAll(): Observable<NonConformite[]> {
    return this.http.get<NonConformite[]>(this.url);
  }

  getById(id: number): Observable<NonConformite> {
    return this.http.get<NonConformite>(`${this.url}/${id}`);
  }

  create(nc: NonConformite): Observable<NonConformite> {
    return this.http.post<NonConformite>(this.url, nc);
  }

  update(id: number, nc: NonConformite): Observable<NonConformite> {
    return this.http.put<NonConformite>(`${this.url}/${id}`, nc);
  }

  resoudre(id: number, actionsCorrectives: string): Observable<NonConformite> {
    return this.http.patch<NonConformite>(`${this.url}/${id}/resoudre`, { actionsCorrectives });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getTotal(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.url}/stats/total`);
  }
}

// ─── SERVICE UTILISATEUR ──────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class UtilisateurService {

private url = 'https://backend-327247053319.europe-west1.run.app/api/utilisateurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.url);
  }

  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.url}/${id}`);
  }

  create(u: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.url, u);
  }

  update(id: number, u: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.url}/${id}`, u);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getTotal(): Observable<{ total: number }> {
    return this.http.get<{ total: number }>(`${this.url}/stats/total`);
  }
}

// ─── SERVICE HISTORIQUE ───────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class HistoriqueService {

private url = 'https://backend-327247053319.europe-west1.run.app/api/historique';

  constructor(private http: HttpClient) {}

  getParRetour(retourId: number): Observable<HistoriqueRetour[]> {
    return this.http.get<HistoriqueRetour[]>(`${this.url}/retour/${retourId}`);
  }
}
