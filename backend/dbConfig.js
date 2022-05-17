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
const userTable = "CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `firstname` varchar(100) COLLATE utf8_bin NOT NULL, `lastname` varchar(100) COLLATE utf8_bin NOT NULL, `email` varchar(100) COLLATE utf8_bin NOT NULL, `password` varchar(100) COLLATE utf8_bin NOT NULL, `photo_url` varchar(255) COLLATE utf8_bin DEFAULT NULL, PRIMARY KEY(`id`), UNIQUE KEY `email_UNIQUE` (`email`)) ENGINE=Innodb AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Création de la table posts
const postTable = "CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `Users_id` int NOT NULL, `Categories_id` int NOT NULL, `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `title` varchar(100) COLLATE utf8_bin NOT NULL, `image_url` text COLLATE utf8_bin NOT NULL, PRIMARY KEY (`id`, `Users_id`), KEY `fk_Posts_Users1_idx` (`Users_id`), CONSTRAINT `fk_posts_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Création de la table comments
const commentsTable = "CREATE TABLE `comments` ( `id` int NOT NULL AUTO_INCREMENT, `Posts_id` int NOT NULL, `Users_id` int NOT NULL, `comment_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, `message` varchar(255) COLLATE utf8_bin NOT NULL, PRIMARY KEY (`id`,`Posts_id`,`Users_id`), KEY `fk_Comments_Users1_idx` (`Users_id`), KEY `fk_Comments_Posts1_idx` (`Posts_id`), CONSTRAINT `fk_Comments_Posts1` FOREIGN KEY (`Posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE, CONSTRAINT `fk_Comments_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
//Création de la table réactions
const reactionsTable = "CREATE TABLE `reactions` (`Posts_id` int NOT NULL, `Users_id` int NOT NULL, `reaction` varchar(45) COLLATE utf8_bin NOT NULL, PRIMARY KEY (`Posts_id`,`Users_id`), KEY `fk_Likes_Users1_idx` (`Users_id`), KEY `fk_Reactions_Posts1_idx` (`Posts_id`), CONSTRAINT `fk_Likes_Users1` FOREIGN KEY (`Users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE, CONSTRAINT `fk_Reactions_Posts1` FOREIGN KEY (`Posts_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";
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
                            console.log(`Schema ${process.env.DATABASE} créé correctement`);
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
                console.log("Tableau users créé correctement");
                await runQuery(postTable);
                console.log("Tableau posts créé correctement");
                await runQuery(commentsTable);
                console.log("Tableau comments créé correctement");
                await runQuery(reactionsTable);
                console.log("Tableau reactions créé correctement");
                await runQuery(globalSelect);
                console.log("Votre base de données a été bien configurée");
                process.exit();
            } catch (err) {
                console.log("ERROR =>", err);
            }
        });
    };
    cycle();
};

runInstall();