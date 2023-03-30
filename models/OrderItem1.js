const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderItemSchema = Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product1",
  },
});

exports.OrderItem1 = mongoose.model("OrderItem1", orderItemSchema);
