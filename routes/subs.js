const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { subscribe, unfollow, isMeFollowed } = require("../controllers/subs");

router.post("/", auth, subscribe);
router.delete("/", auth, unfollow);
router.get("/followed/:id", auth, isMeFollowed);

module.exports = router;
