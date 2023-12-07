const mongoose = require("mongoose");

// Định nghĩa Schema cho đối tượng hình ảnh
const ImageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // Chắc chắn phải có giá trị
  },
  image: {
    data: Buffer, // Dữ liệu của hình ảnh (được lưu dưới dạng Buffer)
    contentType: String, // Loại nội dung của hình ảnh (ví dụ: "image/png")
  },
});

// Tạo Mongoose Model sử dụng Schema đã định nghĩa
module.exports = ImageModel = mongoose.model("imageModel", ImageSchema);
