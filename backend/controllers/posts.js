//Requires
const jwt = require("jsonwebtoken");
const fs = require("fs");
const mysql = require("mysql");
//Erreur
const HttpError = require("../models/http-error");
//Database
const db = require("../config/mySqlDB");
//Récupération de l'id utilisateur par le token
function userId(auth) {
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decodedToken.userId;
    return id;
}

exports.createPost = (req, res, next) => {
    const user = userId(req.headers.authorization);
    const content  = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
    const string = "INSERT INTO posts (users_id, content, image_url) VALUES (?, ?, ?);";
    const inserts = [user, content, imageUrl];
    const sql = mysql.format(string, inserts);
    db.query(sql, (error, post) => {
        if(!error) {
            res.status(201).json({ message: "publication enregistrée"});
        } else {
            return next(new HttpError("Erreur lors de la publication"));
        }
    });
}