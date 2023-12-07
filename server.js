const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3300;

const ImageModel = require("./image.model");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Kết nối MongoDB Atlas
mongoose.connect(
  "mongodb+srv://vuhla63cntt:____----772003@cluster0.8ihbeql.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;

// Kiểm tra kết nối
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Storage
const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("testImage");

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new ImageModel({
        name: req.body.name,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImage
        .save()
        .then(() => res.send("successfully uploaded!"))
        .catch((err) => console.log(err));
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
