const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");

router.post("/create", ProductController.createProduct);
router.put("/update/:id", ProductController.updateProduct);

module.exports = router;
