//Requires
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
//Récupération des posts
const getPosts = require("../models/getPosts");
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

//Récupération de tout les posts
exports.getAllPosts = (req, res, next) => {
    //Récupération de l'id utilisateur
    const user = userId(req.headers.authorization);
    //Appel de la fonction composePost
    getPosts.composePost(user)
    .then((result) => {
        //Envoi du résultat de la requête
        res.status(200).json({
            posts: result
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
    //Appel de la fonction composePost
    getPosts.composePost(user)
    .then((results) => {
        results.sort(function compare(a, b) {
            return a.likes - b.likes
        });
        results.reverse();
        //Envoi du résultat de la requête
        res.status(200).json({
            posts: results
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
    //Requête sql
    db.query(`${sqlRequests.Post} ${sqlRequests.Reactions} ${sqlRequests.Comment} ${sqlRequests.Likers} ${sqlRequests.Dislikers}`, [postId, postId, postId, postId, postId], (error, result, fields) => {
        if(!error) {
            //Test si l'utilisateur à liké ou disliké le post
            let liked = false;
            let disliked = false;
            let likes = 0;
            let dislikes = 0;
            if(result[1].length > 0) {
                likes = result[1][0].likes;
                dislikes = result[1][0].dislikes;
            }
            //Liked
            for( let i = 0; i < result[3].length; i++) {
                if(user.id == result[3][i].id)
                liked = true;
            }
            //Disliked
            for( let i = 0; i < result[4].length; i++) {
                if(user.id == result[4][i].id)
                disliked = true;
            }
            //Récupération et envoi des résultat de la requête
            const results = [{...result[0][0], likes: likes, dislikes: dislikes, commentsCounter: result[2].length, liked: liked, disliked: disliked, usersLikedId: result[3], usersDislikesId: result[4]},{comments: result[2]}];
            res.status(200).json({
                post: results
            });
        //Si il y a une erreur, un message est affiché
        } else {
            return next(new HttpError("erreur lors de la récupération du post", 500));
        }
    });
};
//Récupération d'un commentaire
exports.getOneComment = (req, res, next) => {
    //Récupération de l'id du commentaire
    const commentId = req.params.id;
    const sql = mysql.format(sqlRequests.getOneComment, [commentId]);
    db.query(sql, (error, result) => {
        if(!error) {
            res.status(201).json({ 
                comment: result[0]
            });
        } else {
            return next(new HttpError("erreur lors de la récupération du commentaire", 500));
        }
    })
}