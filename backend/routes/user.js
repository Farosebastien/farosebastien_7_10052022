//Requires
const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
//Controllers
const userCtrl = require("../controllers/user");
const updateUserCtrl = require("../controllers/updateUser");
/*Routes pour la récupération du profil, modification d'un profil
ou d'un mot de passe et suppression d'un profil utilisateur*/
router.get("/:id", auth, userCtrl.getUser);
router.patch("/update" , auth, multer, updateUserCtrl.updateUser);
router.put("/update", auth, updateUserCtrl.updateUserPassword);
router.delete("/:id", auth, userCtrl.deleteUser);

module.exports = router;