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
//Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Création de la requête pour le rôle de l'utilisateur (admin ou propriétaire du commentaire)
    const sqlForRole = mysql.format(sqlRequests.role, [user.id]);
    //Requête sql de récupération du role
    db.query(sqlForRole, (error, result) => {
        //Si rôle n'est pas à null alors c'est un admin
        if (result[0].role == 1) {
            //Si c'est un admin, création de la requête de suppression du commentaire
            const sql = mysql.format(sqlRequests.deleteCommentAdmin, [req.params.comments_id]);
            //Requête sql
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(200).json({ 
                        message: "commentaire supprimé"
                    });
                }
                //Si il y a une erreur, un message est affiché
                else {
                    return next(new HttpError("erreur lors de la suppression du commentaire", 500));
                }
            });
        //Sinon, création de la requête de suppression du commentaire en fonction de l'id utilisateur
        } else {
            const sql = mysql.format(sqlRequests.deleteCommentUser, [req.params.id, user.id]);
            //Requête sql
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(200).json({ 
                        message: "commentaire supprimé"
                    });
                }
                //Si il y a une erreur, un message est affiché
                else {
                    return next(new HttpError("erreur lors de la suppression du commentaire", 500));
                }
            });
        }
    });
};
//Suppression d'un post
exports.deletePost = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Création de la requête pour le nom de fichier ce l'image du post
    const sqlForFile = mysql.format(sqlRequests.getPostImage, [req.params.id]);
    const sqlForRole = mysql.format(sqlRequests.role, [user.id]);
    //Requête sql de récupération du role
    db.query(sqlForRole, (error, result) => {
        if (result[0].role == 1) {
            //Création de la requête pour suppression venant de l'admin
            const sql = mysql.format(sqlRequests.deletePostAdmin, [req.params.id]);
            //Requête sql de verification de récupération du nom de fichier
            db.query(sqlForFile, (error, results) => {
                const file = String(results[0].image_url);
                //Si le nom de l'image ne vaut pas null (si il y a une image)
                if (file.length > 0) {
                    //Récupération du nom de l'image dans le dossier images
                    const filename = file.split("/images/")[1];
                    //Suppression de l'image du dossier image
                    fs.unlink(`images/${filename}`, () => {
                        //Une fois le fichier supprimé, requête sql de suppression du post
                        db.query(sql, (error, result) => {
                            if (!error) {
                                res.status(200).json({ 
                                    message: "post supprimé"
                                });
                            }
                            //Si il y a une erreur, un message est affiché
                            else {
                                return next(new HttpError("erreur lors de la suppression du post", 500));
                            }
                        });
                    });
                //Si il n'y a pas d'image, suppression du post
                } else {
                    db.query(sql, (error, result) => {
                        if (!error) {
                            res.status(200).json({ 
                                message: "post supprimé"
                            });
                        }
                        //Si il y a une erreur, un message est affiché
                        else {
                            return next(new HttpError("erreur lors de la suppression du post", 500));
                        }
                    });
                }
            });
        } else {
            //Création de la requête pour suppression venant d'un user
            const sql = mysql.format(sqlRequests.deletePostUser, [req.params.id, user.id]);
            db.query(sqlForFile, (error, result) => {
                const file = String(result[0].image_url);
                //Si le nom de l'image ne vaut pas null (si il y a une image)
                if (file.length > 0) {
                    //Récupération du nom de l'image dans le dossier images
                    const filename = file.split("/images/")[1];
                    //Suppression de l'image du dossier image
                    fs.unlink(`images/${filename}`, () => {
                        //Une fois le fichier supprimé, requête sql de suppression du post
                        db.query(sql, (error, result) => {
                            if (!error) {
                                res.status(200).json({ 
                                    message: "post supprimé"
                                });
                            }
                            //Si il y a une erreur, un message est affiché
                            else {
                                return next(new HttpError("erreur lors de la suppression du post", 500));
                            }
                        });
                    });
                //Si il n'y a pas d'image, suppression du post
                } else {
                    db.query(sql, (error, result) => {
                        if (!error) {
                            res.status(200).json({ 
                                message: "post supprimé"
                            });
                        }
                        //Si il y a une erreur, un message est affiché
                        else {
                            return next(new HttpError("erreur lors de la suppression du post", 500));
                        }
                    });
                }
            });
        }
    });
};
//Suppression d'une réaction
exports.deleteReaction = (req, res, next) => {
    //Récupération de l'id de l'utilisateur 
    const user = userId(req.headers.authorization);
    //Récupération de l'id du post venant du front
    const postId = req.body.posts_id;
    //Création de la requête sql
    const sql = mysql.format(sqlRequests.deleteReaction, [postId, user.id]);
    //Requête sql
    db.query(sql, (error, result) => {
        //Si il n'y a pas d'erreur, envoie d'un nouveau token
        if(!error) {
            res.status(200).json({
                message: "réaction supprimée"
            });
        //Si il y a une erreur, un message est affiché
        } else {
            return next(new HttpError("erreur lors de la suppression de la réaction", 400));
        };
    });
};