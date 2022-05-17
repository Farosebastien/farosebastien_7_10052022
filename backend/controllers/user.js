//Requires
const jwt = require ("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const validator = require("validator");
const passwordValidator = require("secure-password-validator");
//Erreur
const HttpError = require("../models/http-error");
//Database
const db = require("../config/mySqlDB");
//Options de validation du password
const validations = {
    minLength: 6,
    maxLength: 100,
    digits: true,
    letters: true,
    uppercase: true,
    lowercase: true,
    symbols: false
};
//Regex de contrôle des entrées
const regEx = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ '\-]+$/i;
//Récupération de l'id utilisateur par le token
function userId(auth) {
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return {
        id: decodedToken.userId,
        clearance: decodedToken.account
    };
}
//Récupération du profil d'un utilisateur en fonction de son id
exports.getUser = (req, res, next) => {
    //récupération de la requête venant du front
    const {id} = req.params.id;
    //Création de la requête sql
    const string = "SELECT firstname, lastname, email, photo_url FROM users WHERE id = ?;";
    const inserts = [id];
    const sql = mysql.format(string, inserts);
    //Requête sql et récupération dans la DB 
    db.query(sql, (error, profile) => {
        if(!error) {
            res.status(200).json(profile[0]);
        //Si il y a une erreur c'est que l'utilisateur n'est pas trouvé
        } else {
            return next(new HttpError("utilisateur non trouvé", 404));
        }
    });
};
//Mise à jour du profil d'un utilisateur
exports.updateUser = (req, res, next) => {
    //Récupération de la requête venant du front et de l'id de l'utilisateur ayant émis cette requête
    const user  = userId(req.headers.authorization);
    const { firstname, lastname, email } = req.body;
    //Vérification de l'image de la requête
    let imageUrl;
    //Si il n'y en a pas on laisse image à null
    if(req.body.image === "null") {
        imageUrl;
    //Si c'est une nouvelle image, enregistrement en la renommant
    } else if(req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    //Si c'est la même, on la réenregistre
    } else {
        imageUrl = req.body.image;
    }
    //Validation des entrées de l'utilisateur 
    const isFirstnameValid = validator.matches(firstname, regEx);
    const isLastnameValid = validator.matches(lastname, regEx)
    const isEmailValid = validator.isEmail(email);
    //Si toutes les entrées sont valides
    if(isFirstnameValid && isLastnameValid && isEmailValid) {
        //Création de la requête sql
        const string = "UPDATE users SET firstname = ?, lastname = ? email = ?, photo_url = ? WHERE id = ?;";
        const inserts = [firstname, lastname, email, imageUrl, user.id];
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
        return next(new HttpError("erreur, un des champs requis n'est pas valide", 400));
    }
};
//Mise à jour du mot de passe d'un utilisateur
exports.updateUserPassword = (req, res, next) => {
    //Récupération de la requête venant du front et de l'id de l'utilisateur ayant émis cette requête
    const user = userId(req.headers.authorization);
    const {password} = req.body;
    //si le password est valide
    if(passwordValidator.validate(password, validations).valid) {
        //Cryptage du mot de passe
        bcrypt.hash(req.body.password, 10).then((hash) => {
            //Création de la requête sql
            const string = "UPDATE users SET password = ? WHERE id = ?;";
            const inserts = [hash, user.id];
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
    //Création de la requête sql
    const string = "DELETE FROM users WHERE id = ?;";
    const inserts = [req.params.id];
    const sql = mysql.format(string, inserts);
    //Requête sql et suppression du profil concerné dans la db
    db.query(sql, (error, result) => {
        if(!error) {
            res.status(200).json({ message: "utilisateur supprimé" });
        //Si il y a une erreur, le profil n'a pas été supprimé
        } else {
            return next(new HttpError("erreur, utilisateur non supprimé", 404));
        }
    });
};