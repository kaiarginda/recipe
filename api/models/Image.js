// models/item.js

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  image: { type: String || {} },
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
