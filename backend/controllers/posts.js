//Requires
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mysql = require("mysql");
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
    const string = "INSERT INTO posts (users_id, content, image_url) VALUES (?, ?, ?);";
    const inserts = [user.id, validContent, imageUrl];
    const sql = mysql.format(string, inserts);
    //Requête sql pour envoyer le post dans la DB
    db.query(sql, (error, post) => {
        if(!error) {
            res.status(201).json({ 
                message: "publication enregistrée",
                token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
    if (reaction == 1) {
        //Création de la requête pour envoyer ce nouveau like sur la DB
        const string = "INSERT INTO reactions (likes, dislikes, users_id, posts_id) VALUES (1, 0, ?, ?);";
        const inserts = [user.id, post_id];
        const sql = mysql.format(string, inserts);
        //Requête sql
        db.query(sql, (error, result) => {
            if (!error) {
                res.status(201).json({ 
                    message: "like ajouté",
                    token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
            });
            } else {
                return next(new HttpError("erreur lors de l'ajout du like", 400));
            }
        });
    //Si la réaction est un dislike
    } else {
        //Création de la requête pour envoyer ce nouveau dislike sur la DB
        const string = "INSERT INTO reactions (dislikes, likes, users_id, posts_id) VALUES (1, 0, ?, ?);";
        const inserts = [user.id, post_id];
        const sql = mysql.format(string, inserts);
        //Requête sql
        db.query(sql, (error, result) => {
            if(!error) {
                res.status(201).json({ 
                    message: "dislike ajouté",
                    token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
    const string = "INSERT INTO comments (users_id, posts_id, content) VALUES (?, ?, ?);";
    const inserts = [user.id, post_id, validContent];
    const sql = mysql.format(string, inserts);
    //Requête sql
    db.query(sql, (error, commentId) => {
        if (!error) {
            //Création de la requête pour récupérer le commentaire et lier à son post ainsi les likes et dislikes
            const string = "SELECT users.username, users.photo_url, comments.posts_id AS id, comments.users_id AS users_id, comments.content, comments.comment_date FROM comments INNER JOIN posts ON comments.posts_id = posts.id INNER JOIN users ON comments.users_id = users.id WHERE comments.comments_id = ?;";
            const inserts = [commentId.insertId];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, response) => {
                if (!error) {
                    res.status(201).json({ 
                        comment: response,
                        token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
//Récupération de tout les posts
exports.getAllPosts = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Fonction de récupération des posts et jonction des likes et dislikes en fonction des utilisateurs
    const getPosts = () => {
        return new Promise ((resolve, reject) => {
            try {
                //Création de la requête de récupération des posts qui les ordonne suivant leur date de modification
                const string = "SELECT u.id AS user_id, u.username, u.photo_url, p.content, p.post_date, p.modification_date, p.image_url, p.id AS post_id, r.likes AS likes, r.dislikes AS dislikes, (SELECT likes FROM reactions WHERE user_id = ? AND posts_id = r.posts_id) AS userlikes FROM posts AS p LEFT JOIN reactions AS r ON p.id = r.posts_id JOIN users AS u ON p.users_id = u.id GROUP BY p.id ORDER BY post_date DESC;";
                const inserts = [user.id];
                const sql = mysql.format(string, inserts);
                //Requête sql
                db.query(sql, (error, posts) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(posts);
                    }
                });
            //Si il y a une erreur
            } catch (err) {
                reject(err);
            }
        });
    };
    //Fonction d'ajout des commentaire en fonction de chaque post
    const getCommentCount = (post_id) => {
        return new Promise((resolve, reject) => {
            try {
                //Création de la requête
                const string ="SELECT COUNT(*) as comments FROM comments WHERE posts_id = ?;";
                const inserts = [post_id];
                const sql = mysql.format(string, inserts);
                //Requête sql
                db.query(sql, (error, comments) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(comments[0].comments);
                    }
                });
            //Si il y a une erreur
            } catch (err) {
                reject(err);
            }
        });
    };
    //Fonction asynchrone qui recupère tout les posts dans un array et qui boucle dessus afin d'ajouter tout les commentaires de chaque posts
    const composePost = async () => {
        try {
            //Appel de la fonction getPosts
            let posts = await getPosts();
            //Boucle qui itère sur chaque post
            for (let i = 0; i < posts.length; i++) {
                //Appel de la fonction getCommentCount sur chaque post
                const comments = await getCommentCount(posts[i].posts_id);
                //Ajout des commentaires
                posts[i].comments = comments;
            }
            return posts;
        //Si il y a une erreur
        } catch (err) {
            return new Error(err);
        }
    };
    //Appel de la fonction composePost
    composePost()
    .then((result) => {
        //Envoi du résultat de la requête
        res.status(200).json({
            posts: result,
            token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
        });
    })
    //Si il y a une erreur, un message est affiché
    .catch((error) => {
        return next(new HttpError("erreur lors de la récupération des publications", 500));
    })
};
//Récupération des posts les plus likés
exports.getMostLikedPosts = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Fonction de récupération des posts et jonction des likes et dislikes en fonction des utilisateurs
    const getMostliked = () => {
        return new Promise((resolve, reject) => {
            try {
                //Création de la requête de récupération des posts qui les ordonne suivant leur nombre de likes
                const string = "SELECT u.id AS user_id, u.username, u.photo_url, p.content, p.post_date, p.modification_date, p.image_url, p.id AS post_id, r.likes AS likes, r.dislikes AS dislikes, (SELECT likes FROM reactions WHERE users_id = ? AND posts_id = r.posts_id) AS userlikes FROM posts AS p LEFT JOIN reactions AS r ON p.id = r.posts_id JOIN users AS u ON p.users_id = u.id GROUP BY p.id ORDER BY likes DESC;";
                const inserts = [user.id];
                const sql = mysql.format(string, inserts);
                //Requête sql
                db.query(sql, (error, posts) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(posts);
                    }
                });
            //Si il y a une erreur
            } catch (err) {
                reject(err);
            }
       });
    };
    //Fonction d'ajout des commentaire en fonction de chaque post
    const getCommentCount = (post_id) => {
        return new Promise((resolve, reject) => {
            try {
                //Création de la requête
                const string = "SELECT COUNT(*) as comments FROM comments WHERE posts_id = ?;";
                const inserts = [post_id];
                const sql = mysql.format(string, inserts);
                //Requête sql
                db.query(sql, (error, comments) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(comments[0].comments);
                    }
                });
            //Si il y a une erreur
            } catch (err) {
                reject(err);
            }
        });
    };
    //Fonction asynchrone qui recupère tout les posts dans un array et qui boucle dessus afin d'ajouter tout les commentaires de chaque posts
    const composePost = async () => {
        try {
            //Appel de la fonction getPosts
            let posts = await getMostliked();
            //Boucle qui itère sur chaque post
            for(let i = 0; i < posts.length; i++) {
                //Appel de la fonction getCommentCount sur chaque post
                const comments = await getCommentCount(posts[i].post_id);
                //Ajout des commentaires
                posts[i].comments = comments;
            }
            return posts;
        //Si il y a une erreur
        } catch (err) {
            return new Error(err);
        }
    };
    //Appel de la fonction composePost
    composePost()
    .then((results) => {
        //Envoi du résultat de la requête
        res.status(200).json({
            posts: results,
            token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
        });
    })
    //Si il y a une erreur, un message est affiché
    .catch((error) => {
        return next(new HttpError("erreur lors de la récupération des publications", 500));
    });

};
//Récupération d'un post en fonction de son id
exports.getOnePost = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération de l'id du post à récupérer
    const postId = req.params.id;
    //Création des requête de récupération du post correspondant et de ses commentaires
    const stringForPost = "SELECT u.id AS users_id, u.firstname, u.lastname, u.username, u.photo_url, p.content, p.post_date, p.modification_date, p.id AS post_id, r.likes AS likes, r.dislikes AS dislikes, (SELECT likes FROM reactions WHERE users_id = ? AND posts_id = r.posts_id) AS userlikes FROM posts AS p LEFT JOIN reactions AS r ON p.id = r.posts_id JOIN users AS u ON p.users_id = u.id WHERE p.id = ? GROUP BY p.id;";
    const stringForComment = "SELECT users.id AS users_id, users.firstname, users.lastname, users.photo_url, comments.comments_id, comments.comment_date, comments.modification_date, comments.content FROM comments INNER JOIN users ON comments.users_id = users.id WHERE posts_id = ?;";
    //Requête sql
    db.query(`${stringForPost} ${stringForComment}`, [user.id, postId, postId], (error, result, fields) => {
        if(!error) {
            //Récupération et envoi des résultat de la requête
            const results = [{...result[0][0], commentsCounter: result[1].length},{comments: [...result[1]]}];
            res.status(200).json({
                post: results,
                token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
            });
        //Si il y a une erreur, un message est affiché
        } else {
            console.log(error);
            return next(new HttpError("erreur lors de la récupération du post", 500));
        }
    });
};
//Mise à jour d'un post
exports.updatePost = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération de l'id du post à mettre à jour
    const postId = req.params.id;
    //Récupération du contenu de la requête venant du front
    const postContent = req.body.content;
    let validPostContent;
    let image_url;
    let validImage_url;
    let sql;
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
    //Si l'image ne change pas
    } else {
        //Validation de image_url contre les injections sql
        validImage_url = req.body.image_url;
        if (String(validImage_url).match(regExInjection) == null) {
            image_url = validImage_url;
        } else {
            return next(new HttpError("requête non autorisée", 403));
        }
    }
    if (validPostContent != null) {
        //Création de la requête de mise à jour du post avec content
        const string = "UPDATE posts SET content = ?, image_url = ? WHERE id = ? AND users_id = ?;";
        const inserts = [validPostContent, image_url, postId, user.id];
        sql = mysql.format(string, inserts);
    } else {
        //Création de la requête de mise à jour du post sans modifier le content
        const string = "UPDATE posts SET image_url = ? WHERE id = ? AND users_id = ?;";
        const inserts = [image_url, postId, user.id];
        sql = mysql.format(string, inserts);
    }
    //Requête sql
    db.query(sql, (error, result) => {
        if(!error) {
            res.status(201).json({ 
                message: "publication mise à jour", 
                token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
            });
        //Si il y a une erreur, un message est affiché
        } else {
            return next(new HttpError("erreur lors de la mise à jour de la publication", 500));
        }
    });
};
//Mise à jour d'un commentaire
exports.updateComment = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération de l'id du commentaire à mettre à jour
    const commentId = req.params.comments_id;
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
    const string = "UPDATE comments SET content = ? WHERE comments_id = ? AND users_id = ?;";
    const inserts  = [comment, commentId, user.id];
    const sql = mysql.format(string, inserts);
    //Requête sql de mise à jour
    db.query(sql, (error, result) => {
        if (!error) {
            //Création de la requête de récupération du commentaire mis à jour
            const string = "SELECT users.username, users.photo_url, comments.posts_id AS id, comments.users_id AS users_id, comments.content, comments.modification_date FROM comments INNER JOIN posts ON comments.posts_id = posts.id INNER JOIN users ON comments.users_id = users.id WHERE comments.comments_id = ?;";
            const inserts = [commentId];
            const sql = mysql.format(string, inserts);
            //Requête sql de récupération
            db.query(sql, (error, response) => {
                if (!error) {
                    res.status(201).json({
                        comment: response,
                        token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
                    });
                //Si il y a une erreur, un message est affiché
                } else {
                    return next (new HttpError("erreur lors de la récupération du commentaire", 500));
                }
            });
        //Si il y a une erreur, un message est affiché
        } else {
            return next(new HttpError("erreur lors de la mise à jour du commentaire", 500));
        }
    });
};
//Suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Création de la requête pour le rôle de l'utilisateur (admin ou propriétaire du commentaire)
    const stringForRole = "SELECT role FROM users WHERE id = ?;";
    const insertsForRole = [user.id];
    const sqlForRole = mysql.format(stringForRole, insertsForRole);
    //Requête sql de récupération du role
    db.query(sqlForRole, (error, result) => {
        //Si rôle n'est pas à null alors c'est un admin
        if (result[0].role == 1) {
            //Si c'est un admin, création de la requête de suppression du commentaire 
            string = "DELETE FROM comments WHERE comments_id = ?;";
            inserts = [req.params.comments_id];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(200).json({ 
                        message: "commentaire supprimé",
                        token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
                    });
                }
                //Si il y a une erreur, un message est affiché
                else {
                    return next(new HttpError("erreur lors de la suppression du commentaire", 500));
                }
            });
        //Sinon, création de la requête de suppression du commentaire en fonction de l'id utilisateur
        } else {
            string = "DELETE FROM comments WHERE comments_id = ? AND users_id = ?;";
            inserts = [req.params.id, user.id];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(200).json({ 
                        message: "commentaire supprimé",
                        token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
    //Création de la requête pour le rôle de l'utilisateur (admin ou propriétaire du post)
    const stringForRole = "SELECT role FROM users WHERE id = ?;";
    const insertsForRole = [user.id];
    //Création de la requête pour le nom de fichier ce l'image du post
    const stringForFile = "SELECT image_url FROM posts WHERE id = ?;";
    const insertsForFile = [req.params.id];
    const sqlForFile = mysql.format(stringForFile, insertsForFile);
    const sqlForRole = mysql.format(stringForRole, insertsForRole);
    let string = "";
    let inserts = [];
    //Requête sql de récupération du role
    db.query(sqlForRole, (error, result) => {
        if (result[0].role == 1) {
            //Création de la requête pour suppression venant de l'admin
            string = "DELETE FROM posts WHERE id = ?;";
            inserts = [req.params.id];
            const sql = mysql.format(string, inserts);
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
                                    message: "post supprimé",
                                    token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
                                message: "post supprimé",
                                token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
            string = "DELETE FROM posts WHERE id = ? AND users_id = ?;";
            inserts = [req.params.id, user.id];
            const sql = mysql.format(string, inserts);
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
                                    message: "post supprimé",
                                    token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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
                                message: "post supprimé",
                                token: jwt.sign({ userId: user.id, account: user.role }, process.env.JWT_SECRET_KEY, {expiresIn: "5m"})
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