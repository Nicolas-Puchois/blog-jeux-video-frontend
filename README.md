# Blog Jeux Vidéo - Frontend

## Description

Interface utilisateur du blog de jeux vidéo développée avec Node.js, Express et EJS. Application responsive permettant la gestion des articles et l'authentification des utilisateurs.

## Prérequis

- Node.js 16.0+
- npm ou yarn
- Backend API en cours d'exécution
- Extensions recommandées VS Code :
  - EJS language support
  - SCSS Formatter
  - ESLint
  - Prettier

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

3. Configuration de l'environnement

- Copier `.env.example` vers `.env`
- Configurer les variables :

```properties
PORT=3000
API_URL=http://localhost:8000/api
API_IMG_URL=http://localhost:8000
RECAPTCHA_PUBLIC_KEY=votre_clé_recaptcha
CSRF_TOKEN=votre_token_csrf
```

4. Démarrer le serveur

```bash
npm run dev
# ou
yarn dev
```

## Structure du Projet

```
project/
├── public/            # Fichiers statiques
│   ├── assets/       # JS et CSS compilés
│   ├── lib/          # Utilitaires
│   └── services/     # Services frontend
├── routes/           # Routes Express
├── styles/           # Sources SCSS
│   ├── abstract/     # Mixins, variables
│   └── pages/        # Styles par page
└── views/            # Templates EJS
    ├── components/   # Composants
    └── pages/        # Pages
```

## Points d'API Utilisés

### Authentification

- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `GET /api/valider-email` - Validation email

### Articles

- `GET /api/articles` - Liste articles
- `GET /api/articles/{id}` - Détail article
- `POST /api/articles` - Création
- `PUT /api/articles/{id}` - Modification
- `DELETE /api/articles/{id}` - Suppression
- `POST /api/articles/{id}/image` - Upload image

## Scripts Disponibles

```bash
npm run dev          # Serveur développement
npm run sass         # Compile SCSS
npm run sass:watch   # Watch mode SCSS
npm run build        # Build production
```

## Styles (SCSS)

### Architecture

- Pattern 7-1
- BEM methodology
- Variables globales
- Mixins responsive

### Composants

- Header/Footer
- Navigation
- Forms
- Cards
- Buttons
- Notifications

## Services Frontend

### auth.js

- Gestion JWT
- Login/Logout
- Vérification roles

### formCreationValidate.js

- Validation formulaires
- Messages d'erreur
- Sanitization inputs

### notification.js

- Système de notifications
- Messages success/error
- Animations

## Sécurité

- Protection CSRF
- Validation reCAPTCHA
- JWT sécurisé
- Sanitization inputs
- Protection XSS

## Tests et Qualité

- ESLint configuration
- Prettier
- Validation W3C
- Responsive testing
- Cross-browser testing

## Navigateurs Supportés

- Chrome (2 dernières versions)
- Firefox (2 dernières versions)
- Safari (2 dernières versions)
- Edge (2 dernières versions)

## Maintenance

### Compilation SCSS

```bash
npm run sass
```

### Ajout Nouvelle Page

1. Template EJS (`views/pages/`)
2. Route (`routes/index.js`)
3. Style SCSS (`styles/pages/`)
4. JavaScript (`public/assets/js/`)

## Contribuer

1. Fork le projet
2. Créer branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Description'`)
4. Push (`git push origin feature/ma-feature`)
5. Pull Request

## Licence

MIT
