/* eslint-disable import/no-anonymous-default-export */
import auth from "@/middleware/auth";
import Order from "@/models/Order";
const { default: db } = require("@/lib/mongoDB");

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await deliveredOrder(req, res);
      break;
  }
};

const deliveredOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentocation not valid" });
    const { id } = req.query;

    const order = await Order.findOne({ _id: id });
    if (order.isPaid) {
      await Order.findOneAndUpdate({ _id: id }, { isDelivered: true });

      res.json({
        msg: "Proses pengiriman produk!",
        result: {
          isPaid: true,
          updatedAt: new Date().toLocaleString("en-US", {
            hour12: true,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isDelivered: true,
          methodPay: order.methodPay,
        },
      });
    } else {
      await Order.findOneAndUpdate(
        { _id: id },
        {
          isPaid: true,
          updatedAt: new Date().toLocaleString("en-US", {
            hour12: true,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          methodPay: "Uang sudah diterima",
          isDelivered: true,
        }
      );
      res.json({
        msg: "Update berhasil!",
        result: {
          isPaid: true,
          updatedAt: new Date().toLocaleString("en-US", {
            hour12: true,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          methodPay: "Uang sudah diterima",
          isDelivered: true,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
