//Requires
const jwt = require ("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const validator = require("validator");
const passwordValidator = require("password-validator");
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
//Récupération de l'id utilisateur par le token
function userId(auth) {
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decodedToken.userId;
    return id;
}
//Récupération du profil d'un utilisateur en fonction de son id
exports.getUser = (req, res, next) => {
    //Création de la requête sql
    const string = "SELECT firstname, lastname, username, email, photo_url FROM users WHERE id = ?;";
    const inserts = req.params.id;
    const sql = mysql.format(string, inserts);
    //Requête sql et récupération dans la DB 
    db.query(sql, (error, profile) => {
        if(profile[0] == null) {
            return next(new HttpError("utilisateur non trouvé", 404));
        //Si il y a une erreur c'est que l'utilisateur n'est pas trouvé
        } else {
            res.status(200).json(profile[0]);
        }
    });
};
//Mise à jour du profil d'un utilisateur
exports.updateUser = (req, res, next) => {
    //Récupération de la requête venant du front et de l'id de l'utilisateur ayant émis cette requête
    const user = userId(req.headers.authorization);
    const { firstname, lastname, username, email } = req.body;
    let photo_url;
    //Si il n'y a pas d'image on laisse à null
    if (req.body.image === "null") {
        photo_url;
    //Mise à jour de l'image 
    } else if(req.file) {
        photo_url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    //Si l'image ne change pas
    } else {
        photo_url = req.body.photo_url;
    }
    //Validation des entrées de l'utilisateur 
    const isFirstnameValid = validator.matches(firstname, regEx);
    const isLastnameValid = validator.matches(lastname, regEx);
    const isUsernameValid = validator.matches(username, regEx);
    const isEmailValid = validator.isEmail(email);
    //Si toutes les entrées sont valides
    if(isFirstnameValid && isLastnameValid && isUsernameValid && isEmailValid) {
        //Création de la requête sql
        const string = "UPDATE users SET firstname = ?, lastname = ?, username = ?, email = ?, photo_url = ? WHERE id = ?;";
        const inserts = [firstname, lastname, username, email, photo_url, user];
        const sql = mysql.format(string, inserts);
        //Requête sql et mise à jour du profil dans la DB
        db.query(sql, (error, profile) => {
            if(!error) {
                res.status(200).json({ message: "profil mis à jour" });
            //Si il y a une erreur, la mise à jour a échouée
            } else {
                return next(new HttpError("erreur, mise à jour du profil échouée", 400))
            }
        });
    //Si au moins une des entrées n'est pas valide
    } else {
        //Gestion erreur d'entrées
        let notValid = [];
        !isFirstnameValid ? notValid.push(" Prénom") : "";
        !isUsernameValid ? notValid.push(" nom d'utilisateur") : "";
        !isLastnameValid ? notValid.push(" Nom") : "";
        !isEmailValid ? notValid.push(" E-mail") : "";
        notValid = notValid.join();
        return next(new HttpError("Veuillez vérifier les champs suivants :" + notValid, 400));
    }
};
//Mise à jour du mot de passe d'un utilisateur
exports.updateUserPassword = (req, res, next) => {
    //Récupération de la requête venant du front et de l'id de l'utilisateur ayant émis cette requête
    const user = userId(req.headers.authorization);
    const {password} = req.body;
    //si le password est valide
    if(validation.validate(password)) {
        //Cryptage du mot de passe
        bcrypt.hash(req.body.password, 10).then((hash) => {
            //Création de la requête sql
            const string = "UPDATE users SET password = ? WHERE id = ?;";
            const inserts = [hash, user];
            const sql = mysql.format(string, inserts);
            //Requête sql et mise à jour du mot de passe dans la db
            db.query(sql, (error, password) => {
                if(!error) {
                    res.status(201).json({ message: "mot de passe mis à jour" });
                //Si il y a une erreur, la mise à jour a échouée
                } else {
                    return next(new HttpError ("erreur, mise à jour du mot de passe échouée", 500));
                }
            });
        });
    //Si le mot de passe n'est pas valide
    } else {
        return next(new HttpError ("erreur, votre mot de passe n'est pas valide", 400));
    }
};
//Suppression du profil d'un utilisateur en fonction de son id
exports.deleteUser = (req, res, next) => {
    //Récupération de l'id de l'utilisateur ayant émis cette requête
    const user = userId(req.headers.authorization);
    //Si c'est bien le même utilisateur qui fait la demande
    if(user === Number(req.params.id)) {
        //Création des requêtes sql
        const stringForFile = "SELECT photo_url FROM users WHERE id = ?;";
        const string = "DELETE FROM users WHERE id = ?;";
        const inserts = user;
        const sqlForFile = mysql.format(stringForFile, inserts);
        const sql = mysql.format(string, inserts);
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