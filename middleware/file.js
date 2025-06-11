const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);

    if (file.mimetype.includes("video")) {
      cb(null, "./public/videos");
    } else {
      cb(null, "./public/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const types = [
  "image/gif",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "video/mp4",
  "video/mov",
];

const fileFilter = (req, file, cd) => {
  if (types.includes(file.mimetype)) {
    cd(null, true);
  } else {
    cd(null, false);
  }
};

module.exports = multer({ storage, fileFilter });
