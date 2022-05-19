//Configuration de la base de donnée
//Requires
const mysql = require("mysql");
require("dotenv").config();
//Connection à mysql
const connectParams = mysql.createConnection({
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB
});
//Connection à la base de données mysql une fois celle-ci créée
const db = mysql.createConnection({
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE
});
//Création de la base de donnée
const schema = `CREATE DATABASE ${process.env.DATABASE}`;
//Création de la table users
const userTable = "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `firstname` varchar(100) COLLATE utf8_bin NOT NULL, `lastname` varchar(100) COLLATE utf8_bin NOT NULL, `username` varchar(100) COLLATE utf8_bin NOT NULL, `email` varchar(100) COLLATE utf8_bin NOT NULL, `password` varchar(255) COLLATE utf8_bin NOT NULL, `photo_url` varchar(255) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY(`id`), UNIQUE KEY `email_UNIQUE` (`email`), UNIQUE KEY `username UNIQUE` (`username`)) ENGINE=Innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Création de la table posts
const postTable = "CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `users_id` int NOT NULL, `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `modification_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `content` text COLLATE utf8_bin NOT NULL, `image_url` varchar(100) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`id`, `users_id`), KEY `fk_posts_users1_idx` (`users_id`), CONSTRAINT `fk_posts_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Création de la table comments
const commentsTable = "CREATE TABLE `comments` ( `comments_id` int NOT NULL AUTO_INCREMENT, `posts_id` int NOT NULL, `comment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `modification_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, `content` varchar(255) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`comments_id`,`posts_id`), KEY `fk_comments_posts1_idx` (`posts_id`), CONSTRAINT `fk_comments_posts1` FOREIGN KEY (`posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Création de la table réactions
const reactionsTable = "CREATE TABLE `reactions` (`posts_id` int NOT NULL, `likes` varchar(45) COLLATE utf8_bin DEFAULT NULL, `dislikes` varchar(45) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY (`posts_id`), KEY `fk_reactions_posts1_idx` (`posts_id`), CONSTRAINT `fk_reactions_Posts1` FOREIGN KEY (`posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Utilisation du mode global select pour le only_full_group
const globalSelect = "SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));";
//Fonction d'execution d'une requête sql
const runQuery = (query) => {
    return new Promise((resolve, reject) => {
        try {
            db.query(query, function (err, result) {
                if (err) throw err;
                resolve(true);
            });
        } catch (err) {
            reject(err);
        }
    });
};
//Fonction de connexion et de création de la DB et enfin ajout des différentes tables et jonctions
const runInstall = () => {
    const cycle = async () => {
        const createDB = () => {
            return new Promise((resolve, reject) => {
                try {
                    connectParams.connect(function (err) {
                        if (err) throw err;
                        console.log("Connecté à MySQL");
                        connectParams.query(schema, function (err, result) {
                            if (err) throw err;
                            console.log(`Schéma ${process.env.DATABASE} créé correctement`);
                            resolve(true);
                        });
                    });
                } catch (err) {
                    reject(err);
                }
            });
        };
        await createDB();
        db.connect(async function (err) {
            if (err) throw err;
            try {
                await runQuery(userTable);
                console.log("Table users créé correctement");
                await runQuery(postTable);
                console.log("Table posts créé correctement");
                await runQuery(commentsTable);
                console.log("Table comments créé correctement");
                await runQuery(reactionsTable);
                console.log("Table reactions créé correctement");
                await runQuery(globalSelect);
                console.log("Votre base de données est correctement configurée");
                process.exit();
            } catch (err) {
                console.log("ERROR =>", err);
            }
        });
    };
    cycle();
};

runInstall();