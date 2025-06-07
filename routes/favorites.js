const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const {} = require("../controllers/favorites");

const { favorite, remove, isFavorite } = require("../controllers/favorites");

router.post("/", auth, favorite);
router.delete("/", auth, remove);
router.get("/isFavorite/:postId", auth, isFavorite);

module.exports = router;
