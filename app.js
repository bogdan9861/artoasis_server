const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "*" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/tags", require("./routes/tags"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/subs", require("./routes/subs"));
app.use("/api/favorites", require("./routes/favorites"));

module.exports = app;
