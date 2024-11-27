# API de Gestion des Réservations

## Description

Cette API permet de gérer les réservations, les utilisateurs, les clients, les chambres et les types de chambres, avec des fonctionnalités CRUD (Create, Read, Update, Delete), ainsi qu’une authentification sécurisée pour contrôler l’accès aux ressources. Elle est construite avec Express.js et utilise Prisma avec PostgreSQL pour la gestion de la base de données.

## Objectifs

- Développer et tester une API RESTful avec Express.js et Prisma/PostgreSQL.
- Implémenter une authentification pour sécuriser l’accès aux ressources de l’AP. 


## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma**
- **Postman** (pour tester l'API)


## Installation

Suivez ces étapes pour configurer le projet sur votre machine locale :

**Clonez le repository :**

```bash
git clone https://github.com/AbderahmaneThimbo/reservation-API.git
```

**Accédez au dossier du projet :**

```bash
cd reservation-API
```

**Installez les dépendances :**

```bash
npm install
```

## Configuration de la base de données

1. Assurez-vous que **postgresql** est en cours d'exécution sur votre machine.
2. Créez une base de données pour le projet (par exemple, `gestion_reservation`).
3. Modifiez le fichier `.env.exampl`en le nommant `.env` pour y insérer les informations de connexion à la base de données.

Exemple de fichier `.env` :

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/gestion_reservation" 
PORT=3000
JWT_SECRET=secret
LANGUAGE=fr
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=gestion_reservation
NODE_ENV=production
```


## Utilisation

Pour démarrer l'application :

```bash
npm start
```

L'API sera accessible à `http://localhost:3000/api`.

## Utilisation de Prisma
Prisma est utilisé pour gérer la base de données et faciliter les migrations ainsi que la génération des modèles. Vous devez exécuter les commandes suivantes pour préparer Prisma dans votre projet.

### Générer les fichiers Prisma

Après avoir configuré votre base de données et modifié le fichier `.env`, vous devez générer les fichiers nécessaires à Prisma en utilisant la commande suivante :

```bash
npx prisma generate
```

```bash
npx prisma migrate dev
```
## Génération des données de test (Seeding)

Le projet inclut un fichier de seed qui génère des données de test dans la base de données pour les entités telles que les utilisateurs, clients, chambres, etc.

```bash
npm run seed
```

## Tests unitaires

Des tests unitaires sont fournis pour vérifier le bon fonctionnement des fonctionnalités CRUD.

- **Framework utilisé** : Jasmine
- **Exécution des tests** :

```bash
npm test
```


## Documentation et Collection Postman

Pour tester les différents endpoints de l'API, vous pouvez utiliser la collection Postman incluse dans ce projet. Elle contient toutes les requêtes configurées pour interagir avec l'API.

- **Exporter les collections** : `gestion-reservation-collection.json`
- **Importer dans Postman** et exécuter les requêtes.

## Auteur

[Abderahmane Thimbo](https://github.com/AbderahmaneThimbo)

