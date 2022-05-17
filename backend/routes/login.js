//Requires
const router = require("express").Router();
const bouncer = require("express-bouncer")(10000, 900000);
//Controller
const  loginCtrl = require("../controllers/login");
//Route pour la connexion d'un utilisateur
router.post("/", bouncer.block, loginCtrl.login);

module.exports = router;