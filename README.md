# Reseau social de GROUPOMANIA

Cette application a été créee avec React-JS pour la partie front-end.\
Et pour la partie back-end, avec Node-JS.\
Une base de données SQL y est égalemment associée.

## Installation de l'application GROUPOMANIA

Cloner l'application à partir de ce [repository GIT](https://github.com/Farosebastien/farosebastien_7_10052022.git)

-----------------

## BACK-END

### Installation

1. A l'aide du terminal, se placer dans le dossier `/backend`.
2. Lancer la commande `npm install`.
3. Créer un fichier `.env` à la racine du dossier `/backend` et y entrer les informations suivantes:
    * PORT=5000
    * USERDB="utilisateur de votre base de données SQL"
    * PASSWORDDB="mot de passe de cet utilisateur"
    * HOSTDB="host de votre base de données"
    * DATABASE="nom de la base de données à créer"
    * JWT_SECRET_KEY="clé secrète pour les JSON web token"
4. Lancer la commande `node dbConfig.js` pour configurer la bas de données.

### Démarrage

Lancer la commande `npm start`.

### Arret

Appuyer simulatement sur les touches `ctrl` et `c` du clavier.
Valider par la touche `o` puis `entrée`.

-----------------

## FRONT-END

### Installation

1. A l'aide du terminal, se placer dans le dossier `/backend`.
2. Lancer la commande `npm install`.
3. Créer un fichier `.env` à la racine du dossier `/backend` et y entrer les informations suivantes:
    * REACT_APP_API_URL=http://localhost:5000

### Démarrage

Lancer la commande `npm start`.

### Arret

Appuyer simulatement sur les touches `ctrl` et `c` du clavier.
Valider par la touche `o` puis `entrée`.