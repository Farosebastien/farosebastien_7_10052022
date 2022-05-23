//Requires
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mysql = require("mysql");
//Erreur
const HttpError = require("../models/http-error");
//Database
const db = require("../config/mySqlDB");
const { resolve } = require("path");
//Récupération de l'id utilisateur par le token
function userId(auth) {
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decodedToken.userId;
    return id;
}
//Création d'un nouveau post
exports.createPost = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération du contenu de la requête et de l'eventuelle image
    const content  = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    //Création de la requête sql
    const string = "INSERT INTO posts (users_id, content, image_url) VALUES (?, ?, ?);";
    const inserts = [user, content, imageUrl];
    const sql = mysql.format(string, inserts);
    //Requête sql pour envoyer le post dans la DB
    db.query(sql, (error, post) => {
        if(!error) {
            res.status(201).json({ message: "publication enregistrée"});
        } else {
            return next(new HttpError("erreur lors de la publication", 500));
        }
    });
};
//Création d'une nouvelle réaction
exports.postReaction = (req, res, next) => {
    //Variables likes et dislikes
    let likes;
    let dislikes;
    //récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupération du contenu de la requête
    const { reaction, post_id } = req.body;
    //Si la réaction est un like
    if (reaction > 0) {
        //Création de la requête pour récupérer le nombre de likes déjà existant sur ce post 
        const stringForGetLikes = "SELECT likes FROM reactions WHERE posts_id = ?;";
        const insertsForGetLikes = [post_id];
        const sql = mysql.format(stringForGetLikes, insertsForGetLikes);
        //Requête sql et mise à jour de la variable likes
        db.query(sql, (error, result) => {
            if (!error) {
                likes = result[0].likes;
            } else {
                return next(new HttpError("erreur lors de la récupération des likes", 500));
            }
        });
        // Si il y a déjà des likes sur ce post
        if (likes !== null) {
            //Incrémentation du nouveau like
            likes++;
            //Création de la requête pour envoyer la nouvelle valeur de likes sur la DB
            const string = "UPDATE reactions SET likes = ? WHERE posts_id = ? AND users_id = ?;";
            const inserts = [likes, post_id, user];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(201).json({ message: "like ajouté" });
                } else {
                    return next(new HttpError("erreur lors de l'ajout du like", 400));
                }
            });
        //Si c'est le premier like sur ce post
        } else {
            //Affectation de 1 à likes
            likes = 1;
            //Création de la requête pour envoyer ce nouveau like sur la DB
            const string = "INSERT INTO reactions (likes, users_id, posts_id) VALUES (?, ?, ?);";
            const inserts = [likes, user, post_id];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(201).json({ message: "like ajouté" });
                } else {
                    return next(new HttpError("erreur lors de l'ajout du like", 400));
                }
            });
        }
    //Si la réaction est un dislike
    } else if (reaction < 0) {
        //Création de la requête pour récupérer le nombre de dislikes déjà existant sur ce post
        const stringForGetDislikes = "SELECT dislikes FROM reactions WHERE posts_id = ?;";
        const insertsForGetDislikes = [post_id];
        const sql = mysql.format(stringForGetDislikes, insertsForGetDislikes);
        //Requête sql et mise à jour de la variable dislikes
        db.query = (sql, (error, result) => {
            if (!error) {
                dislikes = result[0].dislikes;
            } else {
                return next(new HttpError("erreur lors de la récupération des dislikes", 500));
            }
        });
        // Si il y a déjà des dislikes sur ce post
        if (dislikes !== null) {
            //Incrémentation du nouveau dislike
            dislikes++;
            //Création de la requête pour envoyer la nouvelle valeur de dislikes sur la DB
            const string = "UPDATE reactions SET dislikes = ? WHERE posts_id = ? AND users_id = ?;";
            const inserts = [dislikes, post_id, user];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, result) => {
                if(!error) {
                    res.status(201).json({ message: "dislike ajouté" });
                } else {
                    return next(new HttpError("erreur lors de l'ajout du like", 400));
                }
            });
        //Si c'est le premier dislike sur ce post
        } else {
            //Affectation de 1 à dislikes
            dislikes = 1;
            //Création de la requête pour envoyer ce nouveau dislike sur la DB
            const string = "INSERT INTO reactions (dislikes, user_id, post_id) VALUES (?, ?, ?);";
            const inserts = [dislikes, user, post_id];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, result) => {
                if(!error) {
                    res.status(201).json({ message: "dislike ajouté" });
                } else {
                    return next(new HttpError("erreur lors de l'ajout du like", 400));
                }
            });
        }
    }
};
//Création d'un nouveau commentaire
exports.postComment = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Récupérarion du contenu de la requête
    const { posts_id, content } = req.body;
    //Création de la requête pour envoyé le commentaire dans la DB
    const string = "INSERT INTO comments (user_id, posts_id, content) VALUES (?, ?, ?);";
    const inserts = [user, posts_id, content];
    const sql = mysql.format(string, inserts);
    //Requête sql
    db.query(sql, (error, commentId) => {
        if (!error) {
            //Création de la requête pour récupérer le commentaire et lier à son post ainsi les likes et dislikes
            const string = "SELECT users.username, users.photo_url, comments.posts_id AS id, comments.users_id as users_id, comments.content, comments.comment_date FROM comments INNER JOIN posts ON comments.posts_id = posts.id INNER JOIN users ON comments.users_id = users.id WHERE comments.comments_id = ?;";
            const inserts = [commentId.insertId];
            const sql = mysql.format(string, inserts);
            //Requête sql
            db.query(sql, (error, response) => {
                if (!error) {
                    res.status(201).json(response);
                } else {
                    return next (new HttpError("erreur lors de la récupération du commentaire", 500));
                }
            });
        } else {
            return next(new HttpError("erreur lors de création du commentaire", 500));
        }
    });
};

exports.getAllPosts = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const getPosts = () => {
        return new Promise ((resolve, reject) => {
            try {
                const string = "SELECT u.id AS user_id, u.username, u.photo_url, p.content, p.post_date, p.modification_date, p.image_url, p.id AS post_id, r.likes AS likes, r.dislikes AS dislikes, (SELECT likes FROM reactions WHERE user_id = ? AND posts_id = r.posts_id) AS userReaction FROM posts AS p LEFT JOIN reactions AS r ON p.id = r.posts_id JOIN users AS u ON p.users_id = u.id GROUP BY p.id ORDER BY modification_date DESC;";
                const inserts = [user];
                const sql = mysql.format(string, inserts);
                db.query(sql, (error, posts) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(posts);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    const getCommentCount = (post_id) => {
        return new Promise((resolve, reject) => {
            try {
                const string ="SELECT COUNT(*) as comments FROM comments WHERE posts_id = ?;";
                const inserts = [post_id];
                const sql = mysql.format(string, inserts);
                db.query(sql, (error, comments) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(comments[0].comments);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    };
    
    const composePost = async () => {
        try {
            let posts = await getPosts();
            for (let i = 0; i < posts.length; i++) {
                const comments = await getCommentCount(posts[i].posts_id);
                posts[i].comments = comments;
            }
            return posts;
        } catch (err) {
            return new Error(err);
        }
    };

    composePost()
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((error) => {
        return next(new HttpError("erreur lors de la récupération des publications", 500));
    })
};

exports.getMostLikedPosts = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const getMostliked = () => {
        return new Promise((resolve, reject) => {
            try {
                const string = "SELECT u.id AS user_id, u.username, u.photo_url, p.content, p.post_date, p.modification_date, p.image_url, p.id AS post_id, r.likes AS likes, r.dislikes AS dislikes, (SELECT likes FROM reactions WHERE users-id = ? ADN posts_id = r.posts_id) AS userReaction FROM posts AS p LEFT JOIN reactions AS r ON p.id = r.posts_id JOIN users AS u ON p.users_id = u.id GROUP BY p.id ORDER BY likes DESC;";
                const inserts = [user];
                const sql = mysql.format(string, inserts);
                db.query(sql, (error, posts) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(posts);
                    }
                });
            } catch (err) {
                reject(err);
            }
       });
    };

    const getCommentCount = (post_id) => {
        return new Promise((resolve, reject) => {
            try {
                const string = "SELECT COUNT(*) as comments FROM comments WHERE posts_id = ?;";
                const inserts = [post_id];
                const sql = mysql.format(string, inserts);
                db.query(sql, (error, comments) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(comments[0].comments);
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    };

    const composePost = async () => {
        try {
            let posts = await getMostliked();
            for(let i = 0; i < posts.length; i++) {
                const comments = await getCommentCount(posts[i].post_id);
                posts[i].comments = comments;
            }
            return posts;
        } catch (err) {
            return new Error(err);
        }
    };

    composePost()
    .then((results) => {
        res.status(200).json(results);
    })
    .catch((error) => {
        return next(new HttpError("erreur lors de la récupération des publications", 500));
    });

};

exports.getOnePost = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const postId = req.params.id;
    const stringForPost = "SELECT u.id AS users_id, u.firstname, u.lastname, u.username, u.photo_url, p.content, p.post_date, p.modification_date, p.id AS post_id, r.likes AS likes, r.dislikes AS dislikes, (SELECT reaction FROM reactions WHERE users_id = ? AND posts_id = r.posts_id) FROM posts AS p LEFT JOIN reactions AS r ON p.id = r.posts_id JOIN users AS u ON p.users_id = u.id WHERE p.id = ? GROUP BY p.id;";
    const stringForComment = "SELECT users.id AS users_id, users.firstname, users.lastname, users.photo_url, comments.comments_id, comments.comment_date, comments.modification_date, comments.content FROM comments INNER JOIN users ON comments.users_id = isers.id WHERE posts_id = ?;";
    db.query(`${stringForPost} ${stringForComment}`, [user.id, postId, postId], (error, result, fields) => {
        if(!error) {
            const results = [{...result[0][0], commentsCounter: result[1].length},{comments: [...result[1]]}];
            res.status(200).json(results);
        } else {
            return next(new HttpError("erreur lors de la récupération du post", 500));
        }
    });
};

exports.updatePost = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const postId = req.params.id;
    const postContent = req.body.content;
    let image_url;
    //Si il n'y a pas d'image on laisse à null
    if (req.body.image === "null") {
        image_url;
    //Mise à jour de l'image 
    } else if(req.file) {
        image_url = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    //Si l'image ne change pas
    } else {
        image_url = req.body.photo_url;
    }
    const string = "UPDATE posts SET content = ?, image_url = ? WHERE id =? AND users_id = ?;";
    const inserts = [postContent, image_url, postId, user];
    const sql = mysql.format(string, inserts);
    db.query(sql, (error, res) => {
        if(!error) {
            res.status(201).json({ message: "publication mise à jour" });
        } else {
            return next(new HttpError("erreur lors de la mise à jour de la publication", 500));
        }
    });
};

exports.updateComment = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const commentId = req.params.id;
    const comment = req.body.content;
    const string = "UPDATE comments SET content = ? WHERE comments_id = ? AND users_id = ?;";
    const inserts  = [comment, commentId, user];
    const sql = mysql.format(string, inserts);
    db.query(sql, (error, commentId) => {
        if (!error) {
            const string = "SELECT users.username, users.photo_url, comments.posts_id AS id, comments.users_id as users_id, comments.content, comments.comment_date FROM comments INNER JOIN posts ON comments.posts_id = posts.id INNER JOIN users ON comments.users_id = users.id WHERE comments.comments_id = ?;";
            const inserts = [commentId.insertId];
            const sql = mysql.format(string, inserts);
            db.query(sql, (error, response) => {
                if (!error) {
                    res.status(201).json(response);
                } else {
                    return next (new HttpError("erreur lors de la récupération du commentaire", 500));
                }
            });
        } else {
            return next(new HttpError("erreur lors de la mise à jour du commentaire", 500));
        }
    });
};

exports.deleteComment = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const stringForRole = "SELECT role FROM users WHERE id = ?;";
    const insertsForRole = [user];
    const sqlForRole = mysql.format(stringForRole, insertsForRole);
    let admin = false;
    db.query(sqlForRole, (error, res) => {
        if (res[0].role) {
            admin= true;
        }
    });
    let string = "";
    let inserts = [];
    if (admin) {
        string = "DELETE FROM posts WHERE id = ?;";
        inserts = [req.params.id];
    } else {
        string = "DELETE FROM posts WHERE id = ? AND users_id = ?;";
        inserts = [req.params.id, user];
    }
    const sql = mysql.format(string, inserts);
    db.query(sql, (error, result) => {
        if (!error) {
            res.status(200).json({ message: "commentaire supprimé" });
        }
        else {
            return next(new HttpError("erreur lors de la suppression du commentaire", 500));
        }
    });
};

exports.deletePost = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const stringForRole = "SELECT role FROM users WHERE id = ?;";
    const insertsForRole = [user];
    const stringForFile = "SELECT image_url FROM posts WHERE id = ?;";
    const insertsForFile = [req.params.id];
    const sqlForFile = mysql.format(stringForFile, insertsForFile);
    const sqlForRole = mysql.format(stringForRole, insertsForRole);
    let admin = false;
    db.query(sqlForRole, (error, res) => {
        if (res[0].role) {
            admin= true;
        }
    });
    let string = "";
    let inserts = [];
    if (admin) {
        string = "DELETE FROM posts WHERE id = ?;";
        inserts = [req.params.id];
    } else {
        string = "DELETE FROM posts WHERE id = ? AND users_id = ?;";
        inserts = [req.params.id, user];
    }
    const sql = mysql.format(string, inserts);
    db.query(sqlForFile, (error, result) => {
        const file = String(result[0].image_url);
        if (file.length > 0) {
            const filename = file.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                db.query(sql, (error, result) => {
                    if (!error) {
                        res.status(200).json({ message: "post supprimé" });
                    }
                    else {
                        return next(new HttpError("erreur lors de la suppression du post", 500));
                    }
                });
            });
        } else {
            db.query(sql, (error, result) => {
                if (!error) {
                    res.status(200).json({ message: "post supprimé" });
                }
                else {
                    return next(new HttpError("erreur lors de la suppression du post", 500));
                }
            });
        }
    });
};