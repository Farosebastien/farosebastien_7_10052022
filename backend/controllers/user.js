//requires
const jwt = require ("jsonwebtoken");
const fs = require("fs");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const validator = require("validator");
const passwordValidator = require("secure-password-validator");
//erreur
const HttpError = require("../models/http-error");
//database
const db = require("../config/mySqlDB");

//options de validation du password
const validations = {
    minLength: 6,
    maxLength: 100,
    digits: true,
    letters: true,
    uppercase: true,
    lowercase: true,
    symbols: false
};

const regEx = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ '\-]+$/i;

//récupération de l'id utilisateur par le token
const userId = (auth) => {
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return{
        id: decodedToken.userId,
        clearance: decodedToken.account
    };
};

//récupération du profil d'un utilisateur en fonction de son id
exports.getUser = (req, res, next) => {
    const {id} = req.params;
    const string = "SELECT firstname, lastname, email, photo_url FROM users WHERE id = ?;";
    const inserts = [id];
    const sql = mysql.format(string, inserts);
    db.query(sql, (error, profile) => {
        if(!error) {
            res.status(200).json(profile[0]);
        } else {
            return next(new HttpError("utilisateur non trouvé", 404));
        }
    });
};

//mise à jour du profil d'un utilisateur
exports.updateUser = (req, res, next) => {
    const user  = userId(req.headers.authorization);
    const { firstname, lastname, email } = req.body;
    let imageUrl;
    if(req.body.image === "null") {
        imageUrl;
    } else if(req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    } else {
        imageUrl = req.body.image;
    }

    const isFirstnameValid = validator.matches(firstname, regEx);
    const isLastnameValid = validator.matches(lastname, regEx)
    const isEmailValid = validator.isEmail(email);

    if(isFirstnameValid && isLastnameValid && isEmailValid) {
        const string = "UPDATE users SET firstname = ?, lastname = ? email = ?, photo_url = ? WHERE id = ?;";
        const inserts = [firstname, lastname, email, imageUrl, user.id];
        const sql = mysql.format(string, inserts);
        db.query(sql, (error, profile) => {
            if(!error) {
                res.status(200).json({ message: "profil mis à jour" });
            } else {
                return next(new HttpError("erreur, mise à jour du profil échouée"))
            }
        });
    } else {
        return next(new HttpError("erreur, un des champs requis n'est pas valide"));
    }
};

//mise à jour du mot de passe d'un utilisateur
exports.updateUserPassword = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const {password} = req.body;
    if(passwordValidator.validate(password, validations).valid) {
        bcrypt.hash(req.body.password, 10).then((hash) => {
            const string = "UPDATE users SET password = ? WHERE id = ?;";
            const inserts = [hash, user.id];
            const sql = mysql.format(string, inserts);
            db.query(sql, (error, password) => {
                if(!error) {
                    res.status(201).json({ message: "mot de passe mis à jour" });
                } else {
                    return next(new HttpError ("erreur, mise à jour du mot de passe échouée", 500));
                }
            });
        });
    } else {
        return next(new HttpError ("erreur, votre mot de passe n'est pas valide", 400));
    }
};

//suppression du profil d'un utilisateur en fonction de son id
exports.deleteUser = (req, res, next) => {
    const string = "DELETE FROM users WHERE id = ?;";
    const inserts = [req.params.id];
    const sql = mysql.format(string, inserts);
    db.query(sql, (error, result) => {
        if(!error) {
            res.status(200).json({ message: "utilisateur supprimé" });
        } else {
            return next(new HttpError("erreur, utilisateur non supprimé", 404));
        }
    });
};