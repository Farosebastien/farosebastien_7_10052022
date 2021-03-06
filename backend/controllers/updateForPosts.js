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
//Mise à jour d'un post
exports.updatePost = (req, res, next) => {
    //Récupération de l'id du post à mettre à jour
    const postId = req.params.id;
    //Récupération du contenu de la requête venant du front
    const postContent = req.body.content;
    let validPostContent;
    let image_url;
    let validImage_url;
    let sqlForFile;
    //Validation de content contre les injections sql
    if (String(postContent).match(regExInjection) == null) {
        validPostContent = postContent;
    } else {
        return next(new HttpError("requête non autorisée", 403));
    }
    //Si il n'y a pas d'image on laisse à null
    if (req.body.image === "null") {
        image_url;
    //Mise à jour de l'image 
    } else if(req.file) {
        image_url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        sqlForFile = mysql.format(sqlRequests.getPostImage, [postId]);
    //Si l'image ne change pas
    } else {
        //Validation de image_url contre les injections sql
        validImage_url = req.body.image;
        if (String(validImage_url).match(regExInjection) == null) {
            image_url = validImage_url;
        } else {
            return next(new HttpError("requête non autorisée", 403));
        }
    }
    //Création de la requête de mise à jour du post avec content
    const sql = mysql.format(sqlRequests.updatePost, [validPostContent, image_url, postId]);
    //Requête sql si ce n'est pas une nouvelle image
    if (!sqlForFile) {
        db.query(sql, (error, result) => {
            if(!error) {
                res.status(201).json({ 
                    message: "publication mise à jour"
                });
            //Si il y a une erreur, un message est affiché
            } else {
                return next(new HttpError("erreur lors de la mise à jour de la publication", 500));
            }
        });
    //Si il y a une nouvelle image , vérification qu'il n'y en a pas une ancienne
    } else {
        db.query(sqlForFile, (error, result) => {
            const file = String(result[0].image_url);
            //si il y en avait une on la supprime avant de mettre à jour le post
            if (file.length > 0) {
                //Récupération du nom de l'image dans le dossier images
                const filename = file.split("/images/")[1];
                //Suppression de l'image du dossier image
                fs.unlink(`images/${filename}`, () => {
                    //Une fois le fichier supprimé, requête sql de mise à jour du post
                    db.query(sql, (error, result) => {
                        if (!error) {
                            res.status(201).json({ 
                                message: "publication mise à jour"
                            });
                        }
                        //Si il y a une erreur, un message est affiché
                        else {
                            return next(new HttpError("erreur lors de la mise à jour du post", 500));
                        }
                    });
                });
            } else {
                db.query(sql, (error, result) => {
                    if(!error) {
                        res.status(201).json({ 
                            message: "publication mise à jour"
                        });
                    //Si il y a une erreur, un message est affiché
                    } else {
                        return next(new HttpError("erreur lors de la mise à jour de la publication", 500));
                    }
                });
            }
        });
    }  
};
//Mise à jour d'un commentaire
exports.updateComment = (req, res, next) => {
    //Récupération de l'id du commentaire à mettre à jour
    const commentId = req.params.id;
    //Récupération du contenu de la requête venant du front
    const comment = req.body.content;
    let validComment;
    //Validation de comment contre les injections sql
    if (String(comment).match(regExInjection) == null) {
        validComment = comment;
    } else {
        return next(new HttpError("requête non autorisée", 403));
    }
    //Création de la requête de mise à jour du commentaire
    const sql = mysql.format(sqlRequests.updateComment, [validComment, commentId]);
    //Requête sql de mise à jour
    db.query(sql, (error, result) => {
        if (!error) {
            res.status(201).json({ 
                message: "commentaire mis à jour"
            });
        //Si il y a une erreur, un message est affiché
        } else {
            return next(new HttpError("erreur lors de la mise à jour du commentaire", 500));
        }
    });
};