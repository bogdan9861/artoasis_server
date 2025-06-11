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
  sendPassword,
} = require("../controllers/users");

router.post("/register", fileMiddleware.single("image"), register);
router.post("/login", login);
router.get("/", auth, current);
router.get("/all", getAll);
router.get("/:id", auth, getById);
router.put("/", auth, fileMiddleware.single("image"), edit);
router.put("/set-banner", auth, fileMiddleware.single("banner"), setBanner);
router.post("/send-password", sendPassword);

module.exports = router;
