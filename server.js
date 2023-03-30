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

//Course On Demand
const categories1 = require("./routes/categories1");
const product1 = require("./routes/product1");
const brand1 = require("./routes/brand1");
app.use("/api/v1/categories", categories1);
app.use("/api/v1/products", product1);
app.use("/api/v1/brands", brand1);

const auth = require("./middlewares/auth1");
const auth1 = require("./routes/auth1");
app.use("/api/v1/auth", auth1);

const customer1 = require("./routes/customer1");
app.use("/api/v1/customers", customer1);

const order1 = require("./routes/orders1");
app.use("/api/v1/orders", order1);

//Upload static files
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(upload.array());

//Port
const port = process.env.APP_PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
