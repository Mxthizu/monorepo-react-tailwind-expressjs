# Backend Express.js Application

## Description

Ce projet est un backend simple basé sur Express.js, organisé de manière modulaire pour évoluer facilement. Il utilise Sequelize comme ORM pour la gestion de la base de données MySQL, avec une structure prête pour l'authentification sécurisée via JWT.

## Prérequis

Assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js (version 14 ou supérieure)
- pnpm (version 6 ou supérieure)
- MySQL

## Installation

1. Clonez le repository :

   ```bash
   git clone <votre_repository_url>
   cd monorepo/packages/backend
   ```

2. Créez un fichier `.env` à la racine du dossier `backend` en vous basant sur le modèle ci-dessous :

   ```bash
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=your_database
   JWT_SECRET=your_secret_key
   ```

3. Installez les dépendances :

   ```bash
   pnpm install
   ```

4. Assurez-vous que MySQL est installé et en cours d'exécution, puis configurez la base de données dans le fichier `.env`.

## Démarrage

Pour démarrer le serveur en mode développement :

```bash
pnpm start
```

Le serveur écoutera par défaut sur le port 3000 (ou celui que vous aurez défini dans le fichier `.env`).

## Structure du Projet

- `config/` : Configuration de la base de données et autres paramètres.
- `controllers/` : Contient les contrôleurs gérant les requêtes.
- `middlewares/` : Middlewares pour la validation et la sécurité.
- `models/` : Définition des modèles de données (Sequelize).
- `routes/` : Déclaration des routes de l'application.
- `services/` : Logique métier, comme la gestion des utilisateurs et des tokens.
- `utils/` : Utilitaires comme le gestionnaire d'erreurs.

## Fonctionnalités

- **Authentification** : Inscription et connexion sécurisées avec bcrypt et JWT.
- **Gestion des utilisateurs** : Stockage sécurisé des mots de passe, et gestion des sessions utilisateur.
- **Middleware de protection** : Protège les routes nécessitant une authentification.

## Utilisation

### Inscription

Envoyez une requête POST à `/api/auth/register` avec un body JSON :

```json
{
  "username": "your_username",
  "email": "your_email",
  "password": "your_password"
}
```

### Connexion

Envoyez une requête POST à `/api/auth/login` avec un body JSON :

```json
{
  "email": "your_email",
  "password": "your_password"
}
```

Vous recevrez un token JWT si la connexion est réussie.

### Protection des routes

Pour accéder aux routes protégées, ajoutez le token JWT dans le header `Authorization` :

```http
Authorization: Bearer <your_jwt_token>
```

## Licence

Ce projet est sous licence MIT.
