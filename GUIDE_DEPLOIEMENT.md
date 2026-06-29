# Guide de déploiement — Site Collège Privé Les Élites de Toumodi

Ce site est en **HTML / CSS / JavaScript pur** (aucune compilation). Il fonctionne tel quel sur
n'importe quel hébergeur. Le **CMS** (espace d'administration `/admin`) est optionnel et repose sur
**Firebase** (gratuit). Sans Firebase, le site affiche le contenu par défaut et reste pleinement
fonctionnel — seul l'espace d'administration nécessite la configuration ci-dessous.

---

## 1. Mise en ligne du site (sans CMS)

Le site fonctionne immédiatement. Deux options :

### Option A — Netlify (recommandé, gratuit)
1. Créez un compte sur [netlify.com](https://www.netlify.com).
2. **Add new site → Deploy manually** : glissez-déposez le dossier du projet.
   *(ou connectez le dépôt GitHub `Jcalixte24/elites` → déploiement automatique à chaque commit)*
3. Le site est en ligne. `netlify.toml` est déjà configuré (en-têtes de sécurité, cache, redirection `/admin`).

### Option B — Hébergeur classique (OVH, cPanel…)
Téléversez tous les fichiers à la racine `public_html/` via FTP.

> **HTTPS** : activez le certificat SSL gratuit (automatique sur Netlify ; « Let's Encrypt » chez OVH/cPanel).

---

## 2. Activer le CMS — créer la base Firebase

L'espace `/admin` permet de modifier le contenu (coordonnées, frais, actualités, enseignants, galerie)
sans toucher au code.

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com) → **Ajouter un projet**
   (nom : *elites-cms* par exemple). Désactivez Google Analytics (inutile).
2. Menu **Realtime Database → Créer une base de données** → région **europe-west1** → démarrer en **mode verrouillé**.
3. Copiez l'URL affichée (ex. `https://elites-cms-default-rtdb.europe-west1.firebasedatabase.app`).
4. Ouvrez **`cms.js`** et remplacez la ligne :
   ```js
   const FIREBASE_URL = 'https://VOTRE-PROJET-default-rtdb.firebasedatabase.app';
   ```
   par votre URL.
5. Dans **Realtime Database → Règles**, collez :
   ```json
   {
     "rules": {
       "cms":   { ".read": true,            ".write": "auth != null" },
       "admin": { ".read": "auth != null",  ".write": "auth != null" }
     }
   }
   ```
   → le contenu public est lisible par tous ; **toute modification exige une connexion**.

---

## 3. Activer la connexion administrateur

1. Dans Firebase : **Authentication → Commencer → Adresse e-mail/mot de passe → Activer**.
2. Onglet **Users → Ajouter un utilisateur** : saisissez l'email et le mot de passe de l'administrateur
   (ex. `direction@collegelesilites.ci`). C'est cet identifiant qui ouvrira `/admin`.
3. Récupérez la **configuration web** : icône engrenage → **Paramètres du projet → Vos applications →
   Web (`</>`)**. Copiez `apiKey`, `authDomain`, `projectId`, `databaseURL`.
4. Ouvrez **`admin/index.html`**, repérez le bloc `firebaseConfig` (vers le bas) et renseignez ces valeurs :
   ```js
   const firebaseConfig = {
     apiKey:      "…",
     authDomain:  "elites-cms.firebaseapp.com",
     projectId:   "elites-cms",
     databaseURL: "https://elites-cms-default-rtdb.europe-west1.firebasedatabase.app"
   };
   ```
5. Redéployez (ou re-téléversez `cms.js` et `admin/index.html`).

---

## 4. Utiliser l'espace d'administration

- Rendez-vous sur **`votre-site.com/admin`**.
- Connectez-vous avec l'email/mot de passe créés à l'étape 3.
- Modifiez puis **Enregistrez** chaque section :
  - **Établissement** — coordonnées, code MEN, année scolaire, statistiques, frais de scolarité.
  - **Actualités** — ajouter / modifier / supprimer les actualités (visibles sur la page Événements).
  - **Enseignants** — gérer la liste du corps enseignant (page Équipe).
  - **Galerie** — ajouter des photos (chemin `img/...` ou URL).
- Les changements sont visibles **immédiatement** sur le site public, sans redéploiement.

> Pour changer le mot de passe administrateur : Firebase → **Authentication → Users → (…) → Réinitialiser**.

---

## 5. Remplacer les images

Les photos sont dans le dossier **`img/`**. Pour mettre à jour une photo, remplacez le fichier
en gardant le même nom, ou ajoutez-en une nouvelle puis référencez-la depuis l'admin (Galerie / Actualités).

Logos disponibles : `logo-badge.png` (badge complet), `logo-mark-white.png` (étoile + « Les Élites » en blanc,
pour fonds sombres), `favicon.png` (icône d'onglet).

---

## 6. Nom de domaine

- **Netlify** : Site settings → Domain management → Add custom domain (ex. `collegelesilites.ci`),
  puis suivez les instructions DNS auprès de votre registraire.
- Pensez à mettre à jour les balises `<link rel="canonical">` et le fichier `sitemap.xml` avec le domaine final.

---

## Récapitulatif des fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Page d'accueil |
| `equipe.html` · `galerie.html` · `evenements.html` · `contact.html` | Pages internes |
| `shared.css` | Styles (charte navy/or) |
| `shared.js` | Animations, menu mobile, lightbox, formulaire |
| `cms.js` | Connexion Firebase + contenu par défaut |
| `cms-hydrate.js` | Injecte le contenu CMS dans les pages |
| `admin/index.html` | Espace d'administration |
| `netlify.toml` · `robots.txt` · `sitemap.xml` | Déploiement & SEO |
| `img/` | Images et logos |

---

*Document de référence — Collège Privé Les Élites de Toumodi · Code MEN 310648.*
