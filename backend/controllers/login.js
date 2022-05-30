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
//Connexion d'un utilisateur
exports.login = (req, res, next) => {
    //récupération de la requête venant du front
    const { email, password } = req.body;
    //Validation des entrées de l'utilisateur
    if (!email && !password) {
        return next(new HttpError("veuillez renseigner vos identifiants", 400));
    } else if (!validator.matches(String(email)) && !validation.validate(String(password)) && String(email).match(regExInjection) != null && String(password).match(regExInjection) != null) {
        return next(new HttpError("vos identifiant ne sont pas un email et un password correct", 400));
    }
    //Si il manque l'email
    if (!email) {
        return next(new HttpError("veuillez renseigner votre email", 400));
    }
    //Si il manque le mot de passe
    if (!password) {
        return next(new HttpError("veuillez renseigner votre mot de passe", 400));
    }
    //Création de la requête sql
    const string = "SELECT id, email, role, password FROM users WHERE email = ?;";
    const inserts = [email];
    const sql = mysql.format(string, inserts);
    //Requête sql et récupération dans la db
    db.query(sql, (error, user) => {
        //Si l'utilisateur est inexistant
        if (user.length === 0) {
            return next(new HttpError("votre adresse e-mail n'est pas valide", 401));
        }
        //Vérification du mot de passe
        bcrypt.compare(password, user[0].password).then((valid) => {
            //Si le mot de passe n'est pas valide
            if (!valid) {
                return next(new HttpError("votre mot de passe n'est pas valide", 401));
            }
            res.status(200).json({
                userId: user[0].id,
                role: !user[0].role ? "user" : "admin",
                token: jwt.sign({ userId: user[0].id, account: user[0].role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
            });
        });
    });
};