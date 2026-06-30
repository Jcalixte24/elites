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
  'site:features': [
    { icon: 'monitor',    title: "Cours d'informatique",           text: "Des ateliers réguliers pour initier nos élèves au numérique et préparer les citoyens de demain dès le collège." },
    { icon: 'activity',   title: "HELO School — suivi personnalisé", text: "Un système de suivi individuel qui permet à chaque élève de progresser à son rythme et d'atteindre son plein potentiel." },
    { icon: 'trophy',     title: "Clubs sportif & artistique",     text: "Football, basketball, arts et bien plus : des activités parascolaires pour révéler les talents et la créativité." },
    { icon: 'bus',        title: "Car de transport",               text: "Un service de transport sécurisé pour faciliter les déplacements des élèves des quartiers et villages environnants." },
    { icon: 'leaf',       title: "Environnement paisible",         text: "Un cadre verdoyant, calme et sécurisé qui favorise la concentration, l'apprentissage et l'épanouissement." },
    { icon: 'book',       title: "Bibliothèque & infirmerie",      text: "Une bibliothèque bien fournie pour encourager la lecture, et une infirmerie pour veiller au bien-être des élèves." },
    { icon: 'home',       title: "Internat — hébergement complet", text: "Les élèves venant de loin bénéficient d'un hébergement sécurisé, de repas équilibrés et d'un encadrement dédié soir et week-end." },
    { icon: 'graduation', title: "Du primaire au lycée",           text: "Un parcours scolaire complet sous un même toit : primaire, collège et lycée, pour accompagner l'élève jusqu'au baccalauréat." },
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
  const keys = ['site:config', 'site:events', 'site:teachers', 'site:gallery', 'site:features'];
  const results = await Promise.all(keys.map(k => cmsGet(k)));
  keys.forEach((k, i) => {
    const shortKey = k.replace('site:', '');
    CMS[shortKey] = (results[i] !== null && results[i] !== undefined) ? results[i] : CMS_DEFAULTS[k];
  });
  CMS.config   = CMS.config   || CMS_DEFAULTS['site:config'];
  CMS.events   = CMS.events   || CMS_DEFAULTS['site:events'];
  CMS.teachers = CMS.teachers || CMS_DEFAULTS['site:teachers'];
  CMS.gallery  = CMS.gallery  || CMS_DEFAULTS['site:gallery'];
  CMS.features = CMS.features || CMS_DEFAULTS['site:features'];
}

/* ════════════════════════════════════════════
   CATALOGUE D'ICÔNES PRÉDÉFINIES (SVG paths)
   Utilisé par le CMS admin pour choisir l'icône des cartes "Nos atouts"
   ════════════════════════════════════════════ */
window.FEAT_ICONS = {
  monitor:    { label:'Informatique',    path:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>' },
  activity:   { label:'Suivi élève',     path:'<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  trophy:     { label:'Trophée',         path:'<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M17 4h3v2a3 3 0 0 1-3 3M7 4H4v2a3 3 0 0 0 3 3"/>' },
  bus:        { label:'Transport',       path:'<path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10"/><path d="M4 12h16M4 17h16v2H4z"/><circle cx="8" cy="17" r="1.4"/><circle cx="16" cy="17" r="1.4"/>' },
  leaf:       { label:'Nature/Calme',    path:'<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 8-4 13-9 13z"/><path d="M4 20c2-4 5-7 9-8"/>' },
  book:       { label:'Bibliothèque',    path:'<path d="M2 4h7a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z"/><path d="M22 4h-7a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z"/>' },
  home:       { label:'Internat',        path:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  graduation: { label:'Diplôme',         path:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5"/>' },
  users:      { label:'Groupe/Élèves',   path:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
  star:       { label:'Excellence',      path:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  shield:     { label:'Sécurité',        path:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  heart:      { label:'Infirmerie',      path:'<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' },
  globe:      { label:'International',   path:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  music:      { label:'Arts/Musique',    path:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>' },
  wifi:       { label:'Numérique',       path:'<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/>' },
  pencil:     { label:'Cours',           path:'<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>' },
  award:      { label:'Récompense',      path:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>' },
  calendar:   { label:'Agenda',          path:'<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  sun:        { label:'Épanouissement',  path:'<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>' },
  target:     { label:'Objectifs',       path:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
  briefcase:  { label:'Formation',       path:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>' },
  lab:        { label:'Sciences',        path:'<path d="M9 3h6v6l3 9H6L9 9V3z"/><path d="M6.5 18h11"/>' },
  paint:      { label:'Créativité',      path:'<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>' },
  church:     { label:'Valeurs',         path:'<path d="M18 22H6a2 2 0 0 1-2-2V9l8-7 8 7v11a2 2 0 0 1-2 2z"/><path d="M9 22V12h6v10"/>' },
};

// Exposer globalement
window.CMS = CMS;
window.cmsGet = cmsGet;
window.cmsSet = cmsSet;
window.cmsDel = cmsDel;
window.loadAllCMS = loadAllCMS;
window.CMS_DEFAULTS = CMS_DEFAULTS;
