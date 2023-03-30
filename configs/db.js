const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://localhost:${process.env.DB_PORT}/${process.env.DB_NAME}`
    );
    console.log("DB connection successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = { connectDB };
