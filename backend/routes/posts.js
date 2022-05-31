//Requires
const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
//Controllers
const postsCtrl = require("../controllers/posts");
//Routes post
router.post("/", auth, multer, postsCtrl.createPost);
router.post("/reaction", auth, postsCtrl.postReaction);
router.post("/comment", auth, postsCtrl.postComment);
//Routes get
router.get("/", auth, postsCtrl.getAllPosts);
router.get("/mostLiked", auth, postsCtrl.getMostLikedPosts);
router.get("/:id", auth, postsCtrl.getOnePost);
//Routes put
router.put("/:id", auth, multer, postsCtrl.updatePost);
router.put("/comments/:comments_id", auth, postsCtrl.updateComment);
//Routes delete
router.delete("/reaction", auth, postsCtrl.deleteReaction);
router.delete("/comments/:comments_id", auth, postsCtrl.deleteComment);
router.delete("/:id", auth, postsCtrl.deletePost);

module.exports = router;