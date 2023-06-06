/* eslint-disable import/no-anonymous-default-export */
import auth from "@/middleware/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
const { default: db } = require("@/lib/mongoDB");

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrder(req, res);
      break;
  }
};

// create Orders
const createOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const {
      fullname,
      handphone,
      address,
      city,
      country,
      poscode,
      itemsPrice,
      shippingPrice,
      totalPrice,
      cart,
    } = req.body;

    const newOrder = new Order({
      user: result.id,
      fullname,
      handphone,
      address,
      city,
      country,
      poscode,
      itemsPrice,
      shippingPrice,
      totalPrice,
      cart,
    });

    cart.filter((item) => {
      return sold(item._id, item.quantity, item.inStock, item.sold);
    });

    await newOrder.save();
    res.json({
      msg: "Pemesanan berhasil! Kami akan menghubungi anda untuk mengkonfirmasi pesanan.",
      newOrder,
    });
  } catch (err) {
    return res.status(500).json({ err: res.message });
  }
};

const sold = async (id, quantity, oldInStock, oldSold) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - quantity,
      sold: quantity + oldSold,
    }
  );
};

// Get Orders
const getOrder = async (req, res) => {
  try {
    const result = await auth(req, res);

    let orders;
    if (result.role !== "admin") {
      orders = await Order.find({ user: result.id }).populate(
        "user",
        "-password"
      );
    } else {
      orders = await Order.find().populate("user", "-password");
    }
    res.json({ orders });
  } catch (err) {
    return res.status(500).json({ err: res.message });
  }
};
