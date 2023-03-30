const { Category1 } = require("../models/Category1");
const express = require("express");
const router = express.Router();

//get list categories
router.get("/", async (req, res) => {
  const categoryList = await Category1.find();

  if (!categoryList) {
    return res.status(500).json({ success: false });
  } else {
    return res.status(200).send(categoryList);
  }
});

//get one by id
router.get("/:id", async (req, res) => {
  const category = await Category1.findById(req.params.id);
  if (!category) {
    res
      .status(500)
      .json({ message: "The Category with the given ID was not found." });
  }
  res.status(200).send(category);
});

//create
router.post("/", async (req, res) => {
  let category = new Category1({
    name: req.body.name,
  });
  category = await category.save();
  if (!category) {
    return res.status(404).send("the category cannot be created!");
  }
  res.send(category);
});

//update
router.put("/:id", async (req, res) => {
  const category = await Category1.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!category) return res.status(400).send("the category cannot be created!");
  res.send(category);
});

//delete
router.delete("/:id", (req, res) => {
  Category1.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "the category is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "category not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
