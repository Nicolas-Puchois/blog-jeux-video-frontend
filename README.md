# Blog Jeux Vidéo - Frontend

## Description

Interface utilisateur du blog de jeux vidéo, développée avec Node.js, Express et EJS.

## Prérequis

- Node.js 16.0 ou supérieur
- npm ou yarn
- Backend API en cours d'exécution

## Installation

1. Cloner le repository

```bash
git clone https://github.com/Nicolas-Puchois/blog-jeux-video-frontend.git
cd blog-jeux-video-frontend
```

2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

3. Configurer l'environnement

- Copier `.env.example` vers `.env`
- Modifier les variables :
  ```
  PORT=3000
  API_URL=http://localhost:8000/api
  API_IMG_URL=http://localhost:8000
  RECAPTCHA_PUBLIC_KEY=votre_clé_recaptcha_publique
  ```

4. Lancer le serveur de développement

```bash
npm run dev
# ou
yarn dev
# ou
npm start
```

## Structure du Projet

```
project/
├── public/            # Fichiers statiques
│   ├── assets/       # JavaScript et CSS compilés
│   ├── lib/          # Bibliothèques utilitaires
│   └── services/     # Services frontend
├── routes/           # Routes Express
├── styles/           # Fichiers SCSS source
│   ├── abstract/     # Mixins et variables
│   ├── components/   # Styles des composants
│   └── pages/        # Styles des pages
└── views/            # Templates EJS
    ├── components/   # Composants réutilisables
    └── pages/        # Pages de l'application
```

## Fonctionnalités

### Utilisateurs

- Inscription
- Connexion
- Validation d'email
- Gestion du profil

### Articles

- Liste des articles
- Création d'article
- Modification d'article
- Suppression d'article
- Upload d'images

### Interface

- Design responsive
- Navigation mobile
- Validation des formulaires côté client
- Notifications interactives
- Protection reCAPTCHA

## Scripts npm

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Compile les assets
npm run sass     # Compile les fichiers SCSS
npm run watch    # Watch mode pour SCSS
```

## Styles (SCSS)

- Architecture 7-1 pattern
- Variables pour les couleurs et breakpoints
- Mixins pour le responsive design
- Styles modulaires par composant

## Sécurité

- Protection CSRF
- Validation reCAPTCHA
- Sanitization des entrées
- Authentification JWT
- Protection XSS

## APIs Utilisées

- Backend API (articles, utilisateurs)
- Google reCAPTCHA v2
- Services de notification

## Compatibilité Navigateurs

- Chrome (dernières 2 versions)
- Firefox (dernières 2 versions)
- Safari (dernières 2 versions)
- Edge (dernières 2 versions)

## Développement

### Compilation SCSS

```bash
# Installation unique des dépendances
npm install -D sass

# Compilation
npm run sass
```

### Ajout de nouvelles pages

1. Créer le template EJS dans `views/pages/`
2. Ajouter la route dans `routes/index.js`
3. Créer le fichier SCSS dans `styles/pages/`
4. Ajouter le JavaScript dans `public/assets/js/`

## Déploiement

1. Configurer les variables d'environnement
2. Compiler les assets
3. Vérifier les permissions des dossiers
4. Lancer avec PM2 ou similar

## Contributions

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit les changements (`git commit -m 'Ajout de ma feature'`)
4. Push sur la branche (`git push origin feature/ma-feature`)
5. Créer une Pull Request

## Licence
