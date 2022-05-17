//Requires
const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
//Controllers
const userCtrl = require("../controllers/user");
/*Routes pour la récupération du profil, modification d'un profil
ou d'un mot de passe et suppression d'un profil utilisateur*/
router.get("/:id", auth, userCtrl.getUser);
router.patch("/update" , auth, multer, userCtrl.updateUser);
router.put("/update", auth, userCtrl.updateUserPassword);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;