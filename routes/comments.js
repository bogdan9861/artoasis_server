const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const { create, remove } = require("../controllers/comments");

router.post("/", auth, create);
router.delete("/", auth, remove);

module.exports = router;
