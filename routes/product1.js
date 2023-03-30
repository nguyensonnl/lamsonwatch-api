const { Product1 } = require("../models/Product1");
const express = require("express");
const { Category1 } = require("../models/Category1");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { Brand1 } = require("../models/Brand1");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

//setup upload files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

//Get all Product and Filter products by category
router.get("/", async (req, res) => {
  //localhost:3000/api/v1/products?categories=234234,234234
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product1.find(filter)
    .populate("category")
    .populate("brand");
  //get category in product
  //.populate('category');//Lấy hết trường của field category
  //.select("name image -_id");// Chỉ lấy ra name image bỏ id

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

//Get a Product
router.get("/:id", async (req, res) => {
  const product = await Product1.findById(req.params.id)
    .populate("brand")
    .populate("category");
  //populate("category");// Lấy cả phần danh mục

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

//Create product
router.post(
  "/",
  uploadOptions.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    const category = await Category1.findById(req.body.category);
    if (!category) return res.status(400).send("Invalid Category");

    const brand = await Brand1.findById(req.body.brand);
    if (!brand) return res.status(400).send("Invalid Brand");

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    const file = req.files["image"] ? req.files["image"][0] : null;
    const files = req.files["images"] ? req.files["images"] : null;

    let singleUpload = "";
    if (!file) {
      return res.status(400).send("No image in the request");
    } else {
      singleUpload = `${basePath}${file.filename}`;
    }

    let imagesPaths = [];
    if (!files) {
      return res.status(400).send("No images in the request");
    } else {
      files.map((file) => imagesPaths.push(`${basePath}${file.filename}`));
    }

    let product = new Product1({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      //image: `${basePath}${fileName}`,
      image: singleUpload,
      images: imagesPaths,
      brand: brand,
      price: req.body.price,
      category: category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();
    if (!product) {
      return res.status(500).send("The product cannot be created");
    }

    res.send(product);

    //Using promise
    /* 
  product
      .save()
      .then((createdProduct) => {
        res.status(201).json(createdProduct);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          success: false,
        });
      });
  */
  }
);

//update product
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid Product Id");
  }

  // const category = await Category1.findById(req.body.category);
  // if (!category) return res.status(400).send("Invalid Category");

  // const brand = await Brand1.findById(req.body.brand);
  // if (!brand) return res.status(400).send("Invalid Category");

  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  // const file = req.files["image"] ? req.files["image"][0] : null;
  // const files = req.files["images"] ? req.files["images"] : null;

  console.log(req.file);
  console.log(req.files);
  const singleUpload = `${basePath}${req.file.filename}`;

  const imagesPaths = [];
  const multipleUpload = req.files.map((file) =>
    imagesPaths.push(`${basePath}${file.filename}`)
  );

  const product = await Product1.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: singleUpload,
      images: multipleUpload,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true,
    }
  );

  if (!product) return res.status(500).send("the category cannot be updated!");

  res.send(product);
});

//Delete a product
router.delete("/:id", (req, res) => {
  Product1.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//get count products
router.get("/get/count", async (req, res) => {
  const productCount = await Product1.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    count: productCount,
  });
});

//get Featured Products
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product1.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
