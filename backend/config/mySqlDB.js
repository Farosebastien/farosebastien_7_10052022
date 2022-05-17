//Connection à la base de données
const mysql = require("mysql");
require("dotenv").config();
//Pool de connection
const db = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 10,
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.DATABASE
});
//Connection à mysql
db.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
    if (error) throw error;
    console.log("Connected successfully to MySQL DB !");
});

module.exports = db;