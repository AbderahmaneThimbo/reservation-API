# API de Gestion des Réservations

## Description

Cette API permet de gérer les réservations, les utilisateurs, les clients, les chambres et les types de chambres, avec des fonctionnalités CRUD (Create, Read, Update, Delete), ainsi qu’une authentification sécurisée pour contrôler l’accès aux ressources. Elle est construite avec Express.js et utilise Prisma avec PostgreSQL pour la gestion de la base de données.

## Objectifs

- Développer et tester une API RESTful avec Express.js et Prisma/PostgreSQL.
- Implémenter une authentification pour sécuriser l’accès aux ressources de l’AP. 


## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js**
- **PostgreSQL**
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

## Génération des données de test (Seeding)

Le projet inclut un fichier de seed qui génère des données de test dans la base de données pour les entités telles que les utilisateurs, clients, chambres, etc.

```bash
npm run seed
```

## Utilisation

Pour démarrer l'application :

```bash
npm start
```

L'API sera accessible à `http://localhost:3000/api`.

## Endpoints de l'API
voici un exemple des endpoints

## Authentification 

L’API utilise un système de JSON Web Token (JWT) pour authentifier les utilisateurs. Les utilisateurs doivent se connecter pour obtenir un jeton qui sera utilisé pour accéder aux routes sécurisées.
## Endpoints d'authentification

### POST /api/login


- **Description** :  Authentifie l’utilisateur et renvoie un JWT. **http://localhost:3000/api/login**
- **Corps de la requête** :
- 
```json
{
  "email": "utilisateur@example.com",
  "password": "votreMotDePasse"
}

```
- **Réponse** :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **Reservations**

### GET /reservations

- **Description** : Récupère toutes les réservations. **http://localhost:3000/api/reservations**
- **Réponse** :

```json
[
  {
        "id": 35,
        "dateDebut": "2024-11-01T14:00:00.000Z",
        "dateFin": "2024-11-10T10:00:00.000Z",
        "chambreId": 40,
        "clientId": 43,
        "utilisateurId": 65,
        "status": "CONFIRMEE",
        "chambre": {
            "id": 40,
            "numeroChambre": 101,
            "prix": 1500,
            "typeId": 56,
            "utilisateurId": 64
        },
        "client": {
            "id": 43,
            "nom": "Client",
            "prenom": "One",
            "telephone": "123456789",
            "utilisateurId": 65
        }
    },
]
```

### GET /reservations

- **Description** : Récupère une reservation par ID. **http://localhost:3000/api/reservations/35**
- **Réponse** :

```json

  {
        "id": 35,
        "dateDebut": "2024-11-01T14:00:00.000Z",
        "dateFin": "2024-11-10T10:00:00.000Z",
        "chambreId": 40,
        "clientId": 43,
        "utilisateurId": 65,
        "status": "CONFIRMEE",
        "chambre": {
            "id": 40,
            "numeroChambre": 101,
            "prix": 1500,
            "typeId": 56,
            "utilisateurId": 64
        },
        "client": {
            "id": 43,
            "nom": "Client",
            "prenom": "One",
            "telephone": "123456789",
            "utilisateurId": 65
        }
    }
```

### POST /reservations

- **Description** : Crée une nouvelle une réservation. **http://localhost:3000/api/reservations**
- **Corps de la requête** :

```json
{
  "dateDebut": "2024-10-22",
  "dateFin": "2024-10-23",
  "status": "CONFIRMEE",
  "chambreId": 1,
  "clientId": 1
}

```

- **Réponse** :

```json
{
  "message": "Reservation ajoutée avec succès"
}
```

### PUT /reservations/:id

- **Description** : Met à jour une reservation existante par ID. **http://localhost:3000/api/reservations/5**
- **Corps de la requête** :

```json
{
  "dateDebut": "2024-10-22",
  "dateFin": "2024-10-23",
  "status": "CONFIRMEE",
  "chambreId": 33,
  "clientId": 1
}
```

- **Réponse** :

```json
{
  "message": "Reservation mise à jour avec succès"
}
```

### DELETE /reservations/:id

- **Description** : Supprime une reservation par ID. **http://localhost:3000/api/reservations/5**
- **Réponse** :

```json
{
  "message": "Reservation supprimée avec succès"
}
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

