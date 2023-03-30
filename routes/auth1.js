const { User1 } = require("../models/User1");
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await User1.findOne({ email });
    if (oldUser) {
      res.status(409).send("User Already Exist. Please Login");
    }

    let encryptedPassword = await bcryptjs.hash(password, 10);

    let user = await User1.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email,
      },
      process.env.APP_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      message: "Success",
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    res.json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    let user = await User1.findOne({ email });
    if (user && (await bcryptjs.compare(password, user.password))) {
      const accessToken = jwt.sign(
        { userId: user._id, email },
        process.env.APP_SECRET,
        { expiresIn: "2h" }
      );

      res.status(200).json({ user, accessToken });
    } else {
      res.status(400).send("Invalid information");
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
