// Import multer, module upload file
const multer = require("multer");

// Setting storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "static/public/images");
  },
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}`;
    cb(null, `img-${suffix}.${file.mimetype.split("/")[1]}`);
  }
});

// Setting filter tipe file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } 
  else {
    cb(new Error("The uploaded file isn't an image file"), false);
  }
}

const upload = multer({ storage, fileFilter });

module.exports = upload;