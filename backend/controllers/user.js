//Requires
const jwt = require ("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const validator = require("validator");
const passwordValidator = require("password-validator");
//Requête sql
const sqlRequests = require("../models/sql-requests");
//Erreur
const HttpError = require("../models/http-error");
//Database
const db = require("../config/mySqlDB");
//Options de validation du password
const validation = new passwordValidator();
validation
.is().min(8)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().symbols()
.has().not().spaces();
//Regex de contrôle des entrées
const regEx = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ '\-]+$/i;
//Regex de contôle des injections sql
const regExInjection = /DROP|TABLE|ALTER/m;
//Récupération de l'id utilisateur par le token
function userId(auth) {
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decodedToken.userId;
    const account = decodedToken.account
    return {
        id: id,
        role: account
    };
}
//Récupération du profil d'un utilisateur en fonction de son id
exports.getUser = (req, res, next) => {
    //Création de la requête sql
    const sql = mysql.format(sqlRequests.getUser, [req.params.id]);
    //Requête sql et récupération dans la DB 
    db.query(sql, (error, profile) => {
        if(profile[0] == null) {
            return next(new HttpError("utilisateur non trouvé", 404));
        //Si il y a une erreur c'est que l'utilisateur n'est pas trouvé
        } else {
            res.status(200).json({
                profile: profile[0]
            });
        }
    });
};
//Suppression du profil d'un utilisateur en fonction de son id
exports.deleteUser = (req, res, next) => {
    //Récupération de l'id de l'utilisateur ayant émis cette requête
    const user = userId(req.headers.authorization);
    //Si c'est bien le même utilisateur qui fait la demande
    if(user.id === Number(req.params.id)) {
        //Création des requêtes sql
        const sqlForFile = mysql.format(sqlRequests.deleteUserForFile, [user.id]);
        const sql = mysql.format(sqlRequests.deleteUser, [user.id]);
        //Requête sql pour récupérer le nom de la photo de l'utilisateur à supprimer
        db.query(sqlForFile, (error, result) => {
            const file = String(result[0].photo_url);
            //Si il y a une photo de profil
            if(file.length > 0) {
                //Récupération du nom du fichier dans le dossier images et suppression
                const fileName = file.split("/images/")[1];
                fs.unlink(`images/${fileName}`, () => {
                    //Requête sql et suppression du profil concerné dans la db
                    db.query(sql, (error, result) => {
                        if(!error) {
                            res.status(200).json({ message: "utilisateur supprimé" });
                        //Si il y a une erreur, le profil n'a pas été supprimé
                        } else {
                            return next(new HttpError("erreur, utilisateur non supprimé", 404));
                        }
                    });
                });
            //Si il n'y a pas de photo de profil
            } else {
                //Requête sql et suppression du profil concerné dans la db
                db.query(sql, (error, result) => {
                    if(!error) {
                        res.status(200).json({ message: "utilisateur supprimé" });
                    //Si il y a une erreur, le profil n'a pas été supprimé
                    } else {
                        return next(new HttpError("erreur, utilisateur non supprimé", 404));
                    }
                });
            }
        }); 
    } else {
        res.status(401).json ({ message: "suppression non autorisée" });
    }
};