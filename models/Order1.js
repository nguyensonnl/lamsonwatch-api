const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);

const orderSchema = new mongoose.Schema({
  orderItem_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem1",
      required: true,
    },
  ],
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer1",
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

//break _id
// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// productSchema.set("toJSON", {
//   virtuals: true,
// });

// const Product = mongoose.model("Product", productSchema);

// module.exports = Product;

exports.Order1 = mongoose.model("Order1", orderSchema);
