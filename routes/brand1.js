const { Brand1 } = require("../models/Brand1");
const express = require("express");
const router = express.Router();

//get all
router.get("/", async (req, res) => {
  const brandList = await Brand1.find();

  if (!brandList) {
    return res.status(500).json({ success: false });
  } else {
    return res.status(200).json(brandList);
  }
});

//get one
router.get("/:id", async (req, res) => {
  const brand = await Brand1.findById(req.params.id);
  if (!brand) {
    res
      .status(500)
      .json({ message: "The Category with the given ID was not found." });
  }
  res.status(200).send(brand);
});

//Create
router.post("/", async (req, res) => {
  let brand = new Brand1({
    name: req.body.name,
  });
  brand = await brand.save();

  if (!brand) {
    return res.status(404).send("the category cannot be created!");
  }
  res.send(brand);
});

//Update
router.put("/:id", async (req, res) => {
  const brand = await Brand1.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!brand) return res.status(400).send("the category cannot be created!");
  res.send(brand);
});

//Delete
router.delete("/:id", (req, res) => {
  Brand1.findByIdAndRemove(req.params.id)
    .then((brand) => {
      if (brand) {
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
