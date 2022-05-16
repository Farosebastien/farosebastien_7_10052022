//requires
const jwt = require("jsonwebtoken");
require("dotenv").config();
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    try {
        //si il n'y a pas d'authentification
        if(!req.headers.authorization) {
            throw next(new HttpError("veuillez vous connecter", 401));
        }
        //si on est authentifié on décode le token
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedToken.userId;
        //si il n'y a pas de user id et qu'il ne coïncide pas avec celui du token
        if(req.body.userId && req.body.userId !== userId) {
            throw next(new HttpError("identifiant non valable", 401));
        //si tout est ok
        } else {
            next();
        }
    } catch {
        return next(new HttpError("requête non authorisée", 403));
    };  
};