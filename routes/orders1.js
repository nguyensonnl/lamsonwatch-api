const { Order1 } = require("../models/Order1");
const express = require("express");
const { OrderItem1 } = require("../models/OrderItem1");
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Order1.find()
    .populate("customer_id", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    return res.status(500).json({ success: false });
  }
  return res.status(200).send(orderList);
});

router.get("/:id", async (req, res) => {
  const order = await Order1.findById(req.params.id)
    .populate("customer_id", "name")
    .populate({
      path: "orderItem_id",
      populate: { path: "product1", populate: "category1" },
    });
  if (!order) {
    res
      .status(500)
      .json({ message: "The Category with the given ID was not found." });
  }
  res.status(200).send(order);
});

router.post("/", async (req, res) => {
  let orderItemsIds = req.body.orderItem_id.map(async (orderItem) => {
    let newOrderItem = new OrderItem1({
      quantity: orderItem.cartQuantity,
      product_id: orderItem._id,
    });

    newOrderItem = await newOrderItem.save();
    return newOrderItem._id;
  });

  orderItemsIds = await Promise.all(orderItemsIds);

  //const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIds.map(async (orderItemId) => {
      const orderItem = await OrderItem1.findById(orderItemId).populate(
        "product_id",
        "price"
      );

      const totalPrice = orderItem.product_id.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order1({
    orderItem_id: orderItemsIds,
    customer_id: req.body.customer_id,
    phone: req.body.phone,
    address: req.body.address,
    note: req.body.note,
    status: req.body.status,
    totalPrice: totalPrice,
  });

  order = await order.save();

  if (!order) {
    return res.status(404).send("The order cannot be created!");
  }
  res.send(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order1.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("the category cannot be created!");
  res.send(order);
});

router.delete("/:id", (req, res) => {
  Order1.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItem_id.map(async (orderItem) => {
          await OrderItem1.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//Tổng giá của các đơn hàng
router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order1.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  return res.send({ totalSales: totalSales.pop().totalSales });
});

//get count products
router.get("/get/count", async (req, res) => {
  const orderCount = await Order1.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    count: orderCount,
  });
});

//get user orders
router.get("/get/userorders/:userid", async (req, res) => {
  const userOrderList = await Order1.find({ customer_id: req.params.userid })
    .populate({
      path: "orderItem_id",
      populate: { path: "product", populate: "category" },
    })
    .sort({ " dateOrdered": -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  return json.send(userOrderList);
});

module.exports = router;
