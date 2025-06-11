const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  create,
  getAllPosts,
  remove,
  edit,
  getById,
  getMostPopular,
} = require("../controllers/posts");

const { like, unlike, isLiked } = require("../controllers/likes");

router.post("/", auth, fileMiddleware.single("file"), create);
router.get("/", getAllPosts);
router.put("/:id", fileMiddleware.single("file"), auth, edit);
router.get("/:id", getById);
router.delete("/:id", auth, remove);

router.post("/:postId/like", auth, like);
router.post("/:postId/unlike", auth, unlike);
router.get("/:postId/liked", auth, isLiked);

module.exports = router;
