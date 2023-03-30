require("dotenv").config();
const { connectDB } = require("./configs/db");

connectDB();
const express = require("express");
const cors = require("cors");

const multer = require("multer");
const upload = multer();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server on");
});

const product1 = require("./routes/product1");
app.use("/api/v1/products", product1);

//Port
const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
