//Requires
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mysql = require("mysql");
//Requête sql
const sqlRequests = require("../models/sql-requests");
//Erreur
const HttpError = require("../models/http-error");
//Database
const db = require("../config/mySqlDB");
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
//Création d'un nouveau post
exports.createPost = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération du contenu de la requête et de l'eventuelle image
    const content  = req.body.content;
    let validContent;
    let imageUrl;
    //Validation de content contre les injections sql
    if (String(content).match(regExInjection) == null) {
        validContent = content;
    } else {
        return next(new HttpError("requête non autorisée", 403));
    }
    if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    }
    //Création de la requête sql
    const sql = mysql.format(sqlRequests.createPost, [user.id, validContent, imageUrl]);
    //Requête sql pour envoyer le post dans la DB
    db.query(sql, (error, post) => {
        if(!error) {
            res.status(201).json({ 
                message: "publication enregistrée"
            });
        } else {
            return next(new HttpError("erreur lors de la publication", 500));
        }
    });
};
//Création d'une nouvelle réaction
exports.postReaction = (req, res, next) => {
    //récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération du contenu de la requête
    const { post_id, reaction } = req.body;
    //Si la réaction est un like
    if (reaction == "1") {
        //Création de la requête pour envoyer ce nouveau like sur la DB
        const sql = mysql.format(sqlRequests.postLike, [user.id, post_id]);
        //Requête sql
        db.query(sql, (error, result) => {
            if (!error) {
                res.status(201).json({ 
                    message: "like ajouté"
            });
            } else {
                return next(new HttpError("erreur lors de l'ajout du like", 400));
            }
        });
    //Si la réaction est un dislike
    } else {
        //Création de la requête pour envoyer ce nouveau dislike sur la DB
        const sql = mysql.format(sqlRequests.postDislike, [user.id, post_id]);
        //Requête sql
        db.query(sql, (error, result) => {
            if(!error) {
                res.status(201).json({ 
                    message: "dislike ajouté"
                });
            } else {
                return next(new HttpError("erreur lors de l'ajout du dislike", 400));
            }
        });
    }
};
//Création d'un nouveau commentaire
exports.postComment = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupérarion du contenu de la requête
    const { post_id, content } = req.body;
    let validContent;
    //Validation de content contre les injections sql
    if (String(content).match(regExInjection) == null) {
        validContent = content;
    } else {
        return next(new HttpError("requête non autorisée", 403));
    }
    //Création de la requête pour envoyé le commentaire dans la DB
    const sql = mysql.format(sqlRequests.postComment, [user.id, post_id, validContent]);
    //Requête sql
    db.query(sql, (error, commentId) => {
        if (!error) {
            //Création de la requête pour récupérer le commentaire et lier à son post ainsi les likes et dislikes
            const sql = mysql.format(sqlRequests.getComment, [commentId.insertId]);
            //Requête sql
            db.query(sql, (error, response) => {
                if (!error) {
                    res.status(201).json({ 
                        comment: response[0]
                    });
                } else {
                    return next (new HttpError("erreur lors de la récupération du commentaire", 500));
                }
            });
        } else {
            return next(new HttpError("erreur lors de création du commentaire", 500));
        }
    });
};