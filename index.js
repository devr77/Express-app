// index.js
const express = require("express");
const app = express();
const PORT = 5000;
const products = require("./products_10000");
const mongoose = require("mongoose");
const Product = require("./models/Product");

// app.get("/", (req, res) => {
//   res.json({
//     msg: "Server is Running",
//   });
// });

app.use(express.static("public")); 

mongoose.connect("mongodb+srv://doadmin:947wY083IN1lujx2@db-mongodb-blr1-83296-4e5aca12.mongo.ondigitalocean.com/admin?tls=true&authSource=admin")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// app.get("/products", (req, res) => {
//   let result = [...products];

//   if (req.query.inStock) {
//     const inStock = req.query.inStock === "true";
//     result = result.filter((p) => p.inStock === inStock);
//   }

//   if (req.query.category) {
//     const category = req.query.category.toLowerCase();
//     result = result.filter((p) => p.category.toLowerCase() === category);
//   }

//   res.json({
//     result,
//     total:result.length
//   });
// });

// app.get("/products/search", (req, res) => {
//   const query = req.query.q?.toLowerCase() || "";
//   const results = products.filter((product) =>
//     product.name.toLowerCase().includes(query)
//   );
//   res.json(results);
// });

app.get("/products", async (req, res) => {
  const { inStock, category, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (inStock !== undefined) filter.inStock = inStock === "true";
  if (category) filter.category = new RegExp(`^${category}$`, "i");

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(products);
});

/**
 * GET /products/search?q=mouse
 */
app.get("/products/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Missing search query ?q=" });

  const products = await Product.find({
    name: new RegExp(q, "i"),
  });

  res.json(products);
});

/**
 * GET /products/sort?by=price&order=asc
 */
app.get("/products/sort", async (req, res) => {
  const { by = "price", order = "asc", page = 1, limit = 20 } = req.query;
  const sortOrder = order === "desc" ? -1 : 1;

  const products = await Product.find()
    .sort({ [by]: sortOrder })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(products);
});

app.get("/products/suggest", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const suggestions = await Product.find({
    name: new RegExp(`^${q}`, "i"),
  }).limit(10);

  // Return only the names
  res.json(suggestions.map(p => p.name));
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
