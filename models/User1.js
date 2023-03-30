const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "First name must be required"],
    },
    lastName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Last name must be required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email must be required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Password must be required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  { timestamps: true }
);

exports.User1 = mongoose.model("User1", userSchema);
