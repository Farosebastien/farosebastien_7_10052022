
const mysql = require("mysql");
//Requête sql
const sqlRequests = require("../models/sql-requests");
//Database
const db = require("../config/mySqlDB");

//Fonction de récupération des posts et jonction des likes et dislikes en fonction des utilisateurs
const getPosts = () => {
    return new Promise ((resolve, reject) => {
        try {
            //Création de la requête de récupération des posts qui les ordonne suivant leur date de modification
            const sql = mysql.format(sqlRequests.getPosts, []);
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
//Fonction d'ajout du nombre de commentaire en fonction de chaque post
const getCommentCount = (post_id) => {
    return new Promise((resolve, reject) => {
        try {
            //Création de la requête
            const sql = mysql.format(sqlRequests.getCommentCount, [post_id]);
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
//Fonction d'ajout du nombre de likes en fonction de chaque post
const getLikesCount = (post_id) => {
    return new Promise((resolve, reject) => {
        try {
            //Création de la requête
            const sql = mysql.format(sqlRequests.getLikesCount, [post_id]);
            //Requête sql
            db.query(sql, (error, likes) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(likes[0].likes);
                }
            });
        //Si il y a une erreur
        } catch (err) {
            reject(err);
        }
    });
};
//Fonction d'ajout du nombre de dislikes en fonction de chaque post
const getDislikesCount = (post_id) => {
    return new Promise((resolve, reject) => {
        try {
            //Création de la requête
            const sql = mysql.format(sqlRequests.getDislikesCount, [post_id]);
            //Requête sql
            db.query(sql, (error, dislikes) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dislikes[0].dislikes);
                }
            });
        //Si il y a une erreur
        } catch (err) {
            reject(err);
        }
    });
};
//Fonction de vérification si l'utilisateur à liké le post courant
const getIsLiked = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        try {
            //Création de la requête
            const sql = mysql.format(sqlRequests.getIsLiked, [post_id, user_id]);
            //Requête sql
            db.query(sql, (error, likes) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(likes);
                }
            });
        //Si il y a une erreur
        } catch (err) {
            reject(err);
        }
    });
};
//Fonction de vérification si l'utilisateur à liké le post courant
const getIsDisliked = (post_id, user_id) => {
    return new Promise((resolve, reject) => {
        try {
            //Création de la requête
            const sql = mysql.format(sqlRequests.getIsDisliked, [post_id, user_id]);
            //Requête sql
            db.query(sql, (error, dislikes) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(dislikes);
                }
            });
        //Si il y a une erreur
        } catch (err) {
            reject(err);
        }
    });
};
//Fonction asynchrone qui recupère tout les posts dans un array et qui boucle dessus afin d'ajouter tout les commentaires de chaque posts
exports.composePost = async (user) => {
    try {
        //Appel de la fonction getPosts
        let posts = await getPosts();
        //Boucles qui itère sur chaque post
        for (let i = 0; i < posts.length; i++) {
            //Appel de la fonction getCommentCount sur chaque post
            const comments = await getCommentCount(posts[i].post);
            //Ajout des commentaires
            posts[i].commentsCounter = comments;
            //Appel de la fonction getLikesCount sur chaque post
            const likes = await getLikesCount(posts[i].post);
            //Ajout des likes
            posts[i].likes = likes;
            //Appel de la fonction getDislikesCount sur chaque post
            const dislikes = await getDislikesCount(posts[i].post);
            //Ajout des dislikes
            posts[i].dislikes = dislikes;
            //Appel de la fonction getIsLiked sur chaque post
            const liked = await getIsLiked(posts[i].post, user.id);
            //Si l'utilisateur a réagi à ce post
            if(liked) {
                if(liked.length > 0) {
                    //Si c'est bien un like
                    if (liked[0].likes == 1) {
                        //Mise à true du booléen
                        posts[i].liked = true;
                    //Sinon mise à false
                    } else {
                        posts[i].liked = false;
                    } 
                } else {
                    posts[i].liked = false;
                }
            } else {
                posts[i].liked = false;
            }
            //Appel de la fonction getIsDisliked sur chaque post
            const disliked = await getIsDisliked(posts[i].post, user.id);
            //Si l'utilisateur a réagi à ce post
            if(disliked) {
                if(disliked.length > 0) {
                    //Si c'est bien un like
                    if (disliked[0].dislikes == 1) {
                        //Mise à true du booléen
                        posts[i].disliked = true;
                    //Sinon mise à false
                    } else {
                        posts[i].disliked = false;
                    } 
                } else {
                    posts[i].disliked = false;
                }
            } else {
                posts[i].disliked = false;
            }
        }
        return posts;
    //Si il y a une erreur
    } catch (err) {
        return new Error(err);
    }
};