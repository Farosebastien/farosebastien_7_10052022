//Requires
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
//Création d'un utilisateur
exports.signup = (req, res, next) => {
    //Récupération de la requête venant du front
    const { firstname, lastname, email, password } = req.body;
    // Regex de contrôle des entrées
    const regEx = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ \'\- ]+$/i;
    //Contrôle des entrées de l'utilisateur 
    const isFirstnameValid = validator.matches(String(firstname), regEx);
    const isLastnameValid = validator.matches(String(lastname), regEx);
    const isEmailValid = validator.isEmail(String(email));
    const isPasswordValid = passwordValidator.validate(String(password), validations).valid;
    //Si toutes les entrées sont valides
    if (isFirstnameValid && isLastnameValid && isEmailValid && isPasswordValid) {
        //Cryptage du mot de passe
        bcrypt.hash(password, 10,).then((hash) => {
            //Création de la requête sql
            const string = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?);";
            const inserts = [firstname, lastname, email, hash];
            const sql = mysql.format(string, inserts);
            //Requête sql et enregistrement dans la DB
            db.query(sql, (error, user) => {
                if(!error) {
                    res.status(201).json({
                        message: "utilisateur créé",
                        userId: user.insertId,
                        token: jwt.sign({ userId: user.insertId }, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})
                    });
                //Si il y a une erreur c'est que l'utilisateur est déjà existant
                } else {
                    return next(new HttpError("utilisateur déjà existant", 400));
                }
            });
        });
    //Si au moins une des entrées n'est pas valide
    } else {
        return next(new HttpError("erreur, un des champs requis n'est pas valide", 400));
    }
};
