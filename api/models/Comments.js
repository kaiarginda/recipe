const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  author: {
    type: String,
  },
  text: {
    type: String,
  },
  parentId: {
    type: String,
  },
  productId: {
    type: String,
  },
  root: {
    type: String,
  },
});
const Comment =
  mongoose.models?.Comment || mongoose.model("Comment", CommentSchema);

module.exports = Comment;
