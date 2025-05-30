const mongoose = require("mongoose");
const products = require("./products_10000");

const MONGO_URI = "mongodb+srv://doadmin:947wY083IN1lujx2@db-mongodb-blr1-83296-4e5aca12.mongo.ondigitalocean.com/admin?tls=true&authSource=admin";

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  price: Number,
  inStock: Boolean,
});

const Product = mongoose.model("Product", productSchema);

async function uploadProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Optional: Clear existing products first
    await Product.deleteMany({});
    console.log("🗑 Cleared existing products");

    // Insert new data
    const result = await Product.insertMany(products);
    console.log(`✅ Inserted ${result.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error uploading products:", error);
    process.exit(1);
  }
}

uploadProducts();
