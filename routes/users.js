const express = require("express");
const router = express.Router();

const fileMiddleware = require("../middleware/file");
const { auth } = require("../middleware/auth");
const {
  register,
  login,
  current,
  edit,
  getById,
  setBanner,
  getAll,
} = require("../controllers/users");

router.post("/register", fileMiddleware.single("image"), register);
router.post("/login", login);
router.get("/", auth, current);
router.get("/all", auth, getAll);
router.get("/:id", auth, getById);
router.put("/", auth, fileMiddleware.single("image"), edit);
router.put("/set-banner", auth, fileMiddleware.single("banner"), setBanner);

module.exports = router;
