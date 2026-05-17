// ============================================================
// MODÈLES TYPESCRIPT
// Ces interfaces définissent la structure des objets JSON
// échangés entre Angular (frontend) et Spring Boot (backend)
// Elles correspondent exactement aux classes Java du backend
// ============================================================

export interface RetourProduit {
  id?: number;
  produit: string;
  client: string;
  emailClient?: string;
  raison: string;
  etatTraitement: string;
  date?: string;
  quantite?: number;
  commentaire?: string;
}

export interface NonConformite {
  id?: number;
  description: string;
  gravite: string;
  date?: string;
  produit: string;
  statut?: string;
  actionsCorrectives?: string;
  retourId?: number;
}

export interface Utilisateur {
  id?: number;
  nom: string;
  email: string;
  role: string;
}

export interface HistoriqueRetour {
  id?: number;
  retourId: number;
  action: string;
  employe: string;
  date?: string;
  commentaire?: string;
}

// Listes de valeurs fixes utilisées dans les formulaires et badges

export const ETATS_RETOUR = [
  { valeur: 'EN_ATTENTE', libelle: 'En attente', badge: 'badge-en-attente' },
  { valeur: 'EN_COURS',   libelle: 'En cours',   badge: 'badge-en-cours'   },
  { valeur: 'VALIDE',     libelle: 'Validé',      badge: 'badge-valide'     },
  { valeur: 'REJETE',     libelle: 'Rejeté',      badge: 'badge-rejete'     },
  { valeur: 'REMBOURSE',  libelle: 'Remboursé',   badge: 'badge-rembourse'  }
];

export const GRAVITES = [
  { valeur: 'FAIBLE',    libelle: 'Faible',   badge: 'badge-faible'   },
  { valeur: 'MOYENNE',   libelle: 'Moyenne',  badge: 'badge-moyenne'  },
  { valeur: 'ELEVEE',    libelle: 'Élevée',   badge: 'badge-elevee'   },
  { valeur: 'CRITIQUE',  libelle: 'Critique', badge: 'badge-critique' }
];

export const ROLES = [
  { valeur: 'ADMIN',     libelle: 'Administrateur' },
  { valeur: 'AGENT_SAV', libelle: 'Agent SAV'       },
  { valeur: 'QUALITE',   libelle: 'Service Qualité' }
];
