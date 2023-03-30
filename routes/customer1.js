const { Customer1 } = require("../models/Customer1");
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!(firstName && lastName && email && password && phone)) {
      res.status(400).send("All input is required");
    }

    const oldUser = await Customer1.findOne({ email });
    if (oldUser) {
      res.status(409).send("Customer Already Exist. Please Login!");
    }

    const encryptedPassword = await bcryptjs.hash(password, 10);

    let customer = await Customer1.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
      phone,
    });

    res.status(200).json({
      message: "Success",
      data: {
        customer,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    let customer = await Customer1.findOne({ email });
    if (customer && (await bcryptjs.compare(password, customer.password))) {
      const accessToken = jwt.sign(
        { customerId: customer._id, email },
        process.env.APP_SECRET
        // { expiresIn: "2h" }
      );

      res.status(200).json({ customer, accessToken });
    } else {
      res.status(400).send("Email or Password Invalid");
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
