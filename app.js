const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");

const path = require("path");
const app = express();
const port = 3300;

const ImageModel = require("./image.model");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "dist"));
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.render("index");
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
        .then(() => {
          // Trả về một đoạn mã JavaScript để hiển thị alert
          res.send(
            '<script>alert("Tải ảnh thành công!"); window.location.href = "/images";</script>'
          );
        })
        .catch((err) => console.log(err));
    }
  });
});

//Hiển thị danh sách ảnh
app.get("/images", async (req, res) => {
  try {
    const images = await ImageModel.find();
    res.render("images", { images });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

//Xử lí tải ảnh
app.get("/download/:id", async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params.id);

    if (!image) {
      return res.status(404).send("Image not found");
    }

    // Chuyển đối tượng Buffer thành chuỗi
    const fileName = image.image.data.toString();
    const filePath = path.join(__dirname, "uploads", fileName);

    console.log("FilePath:", filePath);

    res.download(filePath, image.name, (err) => {
      if (err) {
        console.log("Download Error:", err);
        return res.status(500).send("Internal Server Error");
      }
    });
  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Xử lí xóa ảnh
app.get("/delete/:imageId", async (req, res) => {
  const imageId = req.params.imageId;

  try {
    // Sử dụng findOneAndDelete để xóa ảnh từ MongoDB dựa trên imageId
    const deletedImage = await ImageModel.findOneAndDelete({ _id: imageId });

    if (!deletedImage) {
      return res.status(404).send("Không tìm thấy ảnh để xóa");
    }

    // Gửi mã JavaScript để hiển thị alert và chuyển hướng
    res.send(
      '<script>alert("Xóa ảnh thành công!"); window.location.href = "/images";</script>'
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Lỗi khi xóa ảnh");
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


module.exports = app;
module.exports.handler = serverless(app);
