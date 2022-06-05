//Requires
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const validator = require("validator");
const passwordValidator = require("password-validator");
//Erreur
const HttpError = require("../models/http-error");
//Database
const db = require("../config/mySqlDB");
// Regex de contrôle des entrées
const regEx = /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ \'\- ]+$/i;
//Regex de contôle des injections sql
const regExInjection = /DROP|TABLE|ALTER/m;
//Options de validation du password
const validation = new passwordValidator();
validation
.is().min(8)
.has().uppercase()
.has().lowercase()
.has().digits(1)
.has().symbols()
.has().not().spaces();
//Création d'un utilisateur en rôle user
exports.signup = (req, res, next) => {
    //Récupération de la requête venant du front
    const { firstname, lastname, username, email, password } = req.body;
    //Contrôle des entrées de l'utilisateur 
    let isFirstnameValid = validator.matches(String(firstname), regEx);
    if (String(firstname).match(regExInjection) != null) {
        isFirstnameValid = false;
    }
    let isLastnameValid = validator.matches(String(lastname), regEx);
    if (String(lastname).match(regExInjection) != null) {
        isLastnameValid = false;
    }
    let isUsernameValid = validator.matches(String(username), regEx);
    if (String(username).match(regExInjection) != null) {
        isUsernameValid = false;
    }
    let isEmailValid = validator.isEmail(String(email));
    if (String(email).match(regExInjection) != null) {
        isEmailValid = false;
    }
    let isPasswordValid = validation.validate(String(password));
    if (String(password).match(regExInjection) != null) {
        isPasswordValid = false;
    }
    //Si toutes les entrées sont valides
    if (isFirstnameValid && isLastnameValid && isUsernameValid && isEmailValid && isPasswordValid) {
        //Cryptage du mot de passe
        bcrypt.hash(password, 10).then((hash) => {
            //Création de la requête sql
            const string = "INSERT INTO users (firstname, lastname, username, email, role, password) VALUES (?, ?, ?, ?, 0, ?);";
            const inserts = [firstname, lastname, username, email, hash];
            const sql = mysql.format(string, inserts);
            //Requête sql et enregistrement dans la DB en rôle user
            db.query(sql, (error, user) => {
                if(!error) {
                    res.status(201).json({
                        message: "utilisateur créé",
                        userId: user.insertId,
                        account: "user",
                        token: jwt.sign({ userId: user.insertId, account: 0 }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
                    });
                //Si il y a une erreur c'est que l'utilisateur est déjà existant
                } else {
                    return next(new HttpError("email ou nom d'utilisateur déjà existant", 400));
                }
            });
        });
    //Si au moins une des entrées n'est pas valide
    } else {
        //Gestion erreur d'entrées
        let notValid = [];
        !isFirstnameValid ? notValid.push(" Prénom") : "";
        !isUsernameValid ? notValid.push(" nom d'utilisateur") : "";
        !isLastnameValid ? notValid.push(" Nom") : "";
        !isEmailValid ? notValid.push(" E-mail") : "";
        !isPasswordValid ? notValid.push(" Mot de passe") : "";
        notValid = notValid.join();
        return next(new HttpError("Veuillez vérifier les champs suivants :" + notValid, 400));
    }
};
//Création d'un utilisateur en rôle admin
exports.signupAdmin = (req, res, next) => {
    //Récupération de la requête venant du front
    const { firstname, lastname, username, email, password } = req.body;
    //Contrôle des entrées de l'utilisateur 
    let isFirstnameValid = validator.matches(String(firstname), regEx);
    if (String(firstname).match(regExInjection) != null) {
        isFirstnameValid = false;
    }
    let isLastnameValid = validator.matches(String(lastname), regEx);
    if (String(lastname).match(regExInjection) != null) {
        isLastnameValid = false;
    }
    let isUsernameValid = validator.matches(String(username), regEx);
    if (String(username).match(regExInjection) != null) {
        isUsernameValid = false;
    }
    let isEmailValid = validator.isEmail(String(email));
    if (String(email).match(regExInjection) != null) {
        isEmailValid = false;
    }
    let isPasswordValid = validation.validate(String(password));
    if (String(password).match(regExInjection) != null) {
        isPasswordValid = false;
    }
    //Si toutes les entrées sont valides
    if (isFirstnameValid && isLastnameValid && isUsernameValid && isEmailValid && isPasswordValid) {
        //Cryptage du mot de passe
        bcrypt.hash(password, 10).then((hash) => {
            //Création de la requête sql
            const string = "INSERT INTO users (firstname, lastname, username, email, role, password) VALUES (?, ?, ?, ?, 1, ?);";
            const inserts = [firstname, lastname, username, email, hash];
            const sql = mysql.format(string, inserts);
            //Requête sql et enregistrement dans la DB en rôle admin
            db.query(sql, (error, user) => {
                if(!error) {
                    res.status(201).json({
                        message: "administrateur créé",
                        userId: user.insertId,
                        account: "admin",
                        token: jwt.sign({ userId: user.insertId, account: 1 }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
                    });
                //Si il y a une erreur c'est que l'utilisateur est déjà existant
                } else {
                    return next(new HttpError("email ou nom d'utilisateur déjà existant", 400));
                }
            });
        });
    //Si au moins une des entrées n'est pas valide
    } else {
        //Gestion erreur d'entrées
        let notValid = [];
        !isFirstnameValid ? notValid.push(" Prénom") : "";
        !isUsernameValid ? notValid.push(" nom d'utilisateur") : "";
        !isLastnameValid ? notValid.push(" Nom") : "";
        !isEmailValid ? notValid.push(" E-mail") : "";
        !isPasswordValid ? notValid.push(" Mot de passe") : "";
        notValid = notValid.join();
        return next(new HttpError("Veuillez vérifier les champs suivants :" + notValid, 400));
    }
};