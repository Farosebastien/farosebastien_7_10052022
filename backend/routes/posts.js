//Requires
const router = require("express").Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
//Controllers
const postsCtrl = require("../controllers/postForPosts");
const deletePostsCtrl = require("../controllers/deleteForPosts");
const updatePostsCtrl = require("../controllers/updateForPosts");
const getPostsCtrl = require("../controllers/getForPosts")
//Routes post
router.post("/", auth, multer, postsCtrl.createPost);
router.post("/reaction", auth, postsCtrl.postReaction);
router.post("/comment", auth, postsCtrl.postComment);
//Routes get
router.get("/", auth, getPostsCtrl.getAllPosts);
router.get("/mostLiked", auth, getPostsCtrl.getMostLikedPosts);
router.get("/:id", auth, getPostsCtrl.getOnePost);
router.get("/comments/:id", auth, getPostsCtrl.getOneComment);
//Routes put
router.put("/:id", auth, multer, updatePostsCtrl.updatePost);
router.put("/comments/:id", auth, updatePostsCtrl.updateComment);
//Routes delete
router.delete("/reaction", auth, deletePostsCtrl.deleteReaction);
router.delete("/comments/:comments_id", auth, deletePostsCtrl.deleteComment);
router.delete("/:id", auth, deletePostsCtrl.deletePost);

module.exports = router;