// index.js
const express = require("express");
const app = express();
const PORT = 5000;
const products = require("./products_1000");

app.get("/", (req, res) => {
  res.json({
    msg: "Server is Running",
  });
});

app.get("/products", (req, res) => {
  let result = [...products];

  if (req.query.inStock) {
    const inStock = req.query.inStock === "true";
    result = result.filter((p) => p.inStock === inStock);
  }

  if (req.query.category) {
    const category = req.query.category.toLowerCase();
    result = result.filter((p) => p.category.toLowerCase() === category);
  }

  res.json(result);
});

app.get("/products/search", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const results = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
