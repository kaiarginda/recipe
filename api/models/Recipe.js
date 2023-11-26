// models/item.js

const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: { type: String },
  time: { type: String },
  description: {
    type: String,
  },
  ingredients: {
    type: [],
  },

  image: {
    type: String,
  },
});

const Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe;
