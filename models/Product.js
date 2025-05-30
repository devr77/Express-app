const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
});

module.exports = mongoose.model("Product", productSchema);
