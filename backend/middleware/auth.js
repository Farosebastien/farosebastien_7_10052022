//Requires
const jwt = require("jsonwebtoken");
require("dotenv").config();
//Erreur
const HttpError = require("../models/http-error");
//Decodage du token et vérification de l'authentification
module.exports = (req, res, next) => {
    try {
        //Si il n'y a pas d'authentification
        if(!req.headers.authorization) {
            throw next(new HttpError("veuillez vous connecter", 401));
        }
        //Si on est authentifié on décode le token
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedToken.userId;
        //Si il n'y a pas de user id et qu'il ne coïncide pas avec celui du token
        if(req.body.userId && req.body.userId !== userId) {
            throw next(new HttpError("identifiant non valable", 401));
        //Si tout est ok
        } else {
            next();
        }
    } catch {
        return next(new HttpError("requête non authorisée", 403));
    };  
};