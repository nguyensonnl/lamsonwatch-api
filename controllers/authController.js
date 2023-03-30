const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = jwt.sign({ userID: user._id }, process.env.APP_SECRET);

    res.status(200).json({
      status: "success",
      data: {
        token,
        userName: user.name,
      },
    });
  } catch (error) {
    res.json(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //Error: Email is not correct
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);

      res.status(200).json({
        status: "success",
        data: {
          token,
          userName: user.name,
        },
      });
    } else {
      //Error: Password is not correct
    }
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  register,
  login,
};
