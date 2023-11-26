// models/item.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String },
  followers: {
    type: [],
    default: [],
  },
  following: {
    type: [],
    default: [],
  },
  favourites: {
    type: [],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
