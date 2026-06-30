/**
 * cms.js — CMS (Firebase Realtime Database)
 * Collège Privé Les Élites de Toumodi
 *
 * CONFIGURATION : remplacez FIREBASE_URL ci-dessous par l'URL de votre
 * Realtime Database Firebase (voir GUIDE_DEPLOIEMENT.md, étape 2).
 *
 * Fonctionne sur Netlify, OVH, cPanel ou tout hébergeur statique.
 * Si Firebase est vide ou inaccessible, le contenu par défaut ci-dessous
 * est utilisé (le site reste fonctionnel sans configuration).
 */

/* ════════════════════════════════════════════
   VOTRE CONFIGURATION FIREBASE ICI
   ════════════════════════════════════════════ */
const FIREBASE_URL = 'https://elites-cms-default-rtdb.europe-west1.firebasedatabase.app';

/* ════════════════════════════════════════════
   Règles de sécurité Firebase à appliquer
   (Console → Realtime Database → Règles) :
   {
     "rules": {
       "cms":   { ".read": true,         ".write": "auth != null" },
       "admin": { ".read": "auth != null", ".write": "auth != null" }
     }
   }
   → cms/   : lecture publique, écriture réservée aux admins authentifiés
   → admin/ : lecture + écriture réservées aux admins authentifiés
   ════════════════════════════════════════════ */

// Firebase n'accepte pas ":" dans les clés → "site:config" devient "site_config"
function toFirebaseKey(key) {
  return key.replace(/:/g, '_').replace(/[.#$\[\]]/g, '_');
}

// Token d'authentification partagé avec admin/index.html
window.FIREBASE_ID_TOKEN = window.FIREBASE_ID_TOKEN || null;

// Construit le chemin Firebase (la REST API exige ?auth= pour l'écriture)
function getFirebasePath(key) {
  let url;
  if (key.startsWith('admin:')) {
    url = `${FIREBASE_URL}/admin/${toFirebaseKey(key)}.json`;
  } else {
    url = `${FIREBASE_URL}/cms/${toFirebaseKey(key)}.json`;
  }
  const token = window.FIREBASE_ID_TOKEN;
  if (token) url += `?auth=${token}`;
  return url;
}

async function cmsGet(key) {
  try {
    const res = await fetch(getFirebasePath(key), { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) { console.warn(`[CMS] lecture "${key}" :`, e.message); return null; }
}

async function cmsSet(key, value) {
  try {
    const res = await fetch(getFirebasePath(key), {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
    return res.ok;
  } catch (e) { console.warn(`[CMS] écriture "${key}" :`, e.message); return false; }
}

async function cmsDel(key) {
  try {
    const res = await fetch(getFirebasePath(key), { method: 'DELETE' });
    return res.ok;
  } catch (e) { console.warn(`[CMS] suppression "${key}" :`, e.message); return false; }
}

/* ════════════════════════════════════════════
   CONTENU PAR DÉFAUT
   (affiché si Firebase est vide ou inaccessible)
   ════════════════════════════════════════════ */
const CMS_DEFAULTS = {
  'site:config': {
    name: 'Collège Privé Les Élites de Toumodi',
    code: '310648',
    tel: '+225 07 08 66 59 04',
    tel2: '+225 07 87 12 22 89',
    email: 'collegeelites.tdi@gmail.com',
    address: "Route de Oumé, face à la caserne des Sapeurs-Pompiers — Toumodi, Côte d'Ivoire",
    year: '2026-2027',
    whatsapp: '2250711766284',
    // statistiques (page d'accueil)
    s1: 300, s2: 20, s3: 4, s4: 6,
    // frais
    inscription: '37 000 FCFA',
    examen: '3 000 FCFA',
  },
  'site:events': [
    { img: 'img/flyers2.jpeg', date: 'Septembre 2025', title: "Ouverture des inscriptions 2026-2027", text: "Les inscriptions pour la nouvelle année scolaire sont ouvertes. Places limitées.", tag: 'Inscriptions' },
    { img: 'img/image-salle_de_classe.jpeg', date: 'Septembre 2025', title: "De nouvelles salles équipées", text: "Le collège poursuit l'aménagement de salles modernes et lumineuses pour le confort d'apprentissage des élèves.", tag: 'Campus' },
    { img: 'img/image-cours.jpeg', date: 'Année 2026-2027', title: "Lancement des clubs scolaires", text: "Clubs sportifs et artistiques : les élèves peuvent s'inscrire et révéler leurs talents tout au long de l'année.", tag: 'Vie scolaire' },
  ],
  'site:teachers': [
    { name: 'Professeur de Mathématiques',     subj: 'Mathématiques',       cycle: '6ᵉ à 3ᵉ' },
    { name: 'Professeur de Français',          subj: 'Français',            cycle: '6ᵉ à 3ᵉ' },
    { name: "Professeur d'Anglais",            subj: 'Anglais',             cycle: '6ᵉ à 3ᵉ' },
    { name: 'Professeur de Physique-Chimie',   subj: 'Sciences physiques',  cycle: '4ᵉ et 3ᵉ' },
    { name: 'Professeur de SVT',               subj: 'Sciences de la vie',  cycle: '6ᵉ à 3ᵉ' },
    { name: "Professeur d'Histoire-Géo",       subj: 'Histoire-Géographie', cycle: '6ᵉ à 3ᵉ' },
    { name: "Professeur d'Informatique",       subj: 'Informatique',        cycle: '6ᵉ à 3ᵉ' },
    { name: "Professeur d'EPS",                subj: 'Éducation physique',  cycle: '6ᵉ à 3ᵉ' },
  ],
  'site:gallery': [
    { src: 'img/image-cours.jpeg',           caption: 'Le campus' },
    { src: 'img/image-salle_de_classe.jpeg', caption: 'Salle de classe' },
    { src: 'img/flyers.jpeg',                caption: 'Rentrée 2026-2027' },
    { src: 'img/flyers2.jpeg',               caption: 'Normes internationales' },
  ],
  // Identifiants admin — le mot de passe n'est PAS stocké ici.
  // L'authentification se fait via Firebase Authentication (email + mot de passe).
  // Voir GUIDE_DEPLOIEMENT.md étape 3.
  'admin:meta': { lastUpdate: '' },
};

/* ════════════════════════════════════════════
   CHARGEMENT GLOBAL
   ════════════════════════════════════════════ */
const CMS = {};

async function loadAllCMS() {
  const keys = ['site:config', 'site:events', 'site:teachers', 'site:gallery'];
  const results = await Promise.all(keys.map(k => cmsGet(k)));
  keys.forEach((k, i) => {
    const shortKey = k.replace('site:', '');
    CMS[shortKey] = (results[i] !== null && results[i] !== undefined) ? results[i] : CMS_DEFAULTS[k];
  });
  CMS.config   = CMS.config   || CMS_DEFAULTS['site:config'];
  CMS.events   = CMS.events   || CMS_DEFAULTS['site:events'];
  CMS.teachers = CMS.teachers || CMS_DEFAULTS['site:teachers'];
  CMS.gallery  = CMS.gallery  || CMS_DEFAULTS['site:gallery'];
}

// Exposer globalement
window.CMS = CMS;
window.cmsGet = cmsGet;
window.cmsSet = cmsSet;
window.cmsDel = cmsDel;
window.loadAllCMS = loadAllCMS;
window.CMS_DEFAULTS = CMS_DEFAULTS;
