/* eslint-disable import/no-anonymous-default-export */
import auth from "@/middleware/auth";
import Order from "@/models/Order";
const { default: db } = require("@/lib/mongoDB");

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await paymentOrder(req, res);
      break;
    case "DELETE":
      await deleteOrder(req, res);
      break;
  }
};
const deleteOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Order.findByIdAndDelete(id);
    res.json({ msg: "Hapus kategori berhasil!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const paymentOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentocation not valid" });
    const { id } = req.query;

    const order = await Order.findOne({ _id: id });
    if (order.isPaid) {
      await Order.findOneAndUpdate({ _id: id }, { isDelivered: false });

      res.json({
        msg: "Proses pengiriman produk!",
        result: {
          isPaid: true,
          dateOfPayment: new Date().toLocaleString("en-US", {
            hour12: true,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isDelivered: false,
          methodPay: order.methodPay,
        },
      });
    } else {
      await Order.findOneAndUpdate(
        { _id: id },
        {
          isPaid: true,
          dateOfPayment: new Date().toLocaleString("en-US", {
            hour12: true,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          methodPay: "Uang sudah diterima",
          isDelivered: false,
        }
      );
      res.json({
        msg: "Update berhasil!",
        result: {
          isPaid: true,
          dateOfPayment: new Date().toLocaleString("en-US", {
            hour12: true,
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }),
          methodPay: "Uang sudah diterima",
          isDelivered: false,
        },
      });
    }
    // if (result.role === "user") {
    //   const { id } = req.query;

    //   await Order.findOneAndUpdate(
    //     { _id: id },
    //     {
    //       isPaid: true,
    //       dateOfPayment: new Date().toLocaleString("en-US", {
    //         hour12: true,
    //         year: "numeric",
    //         month: "short",
    //         day: "2-digit",
    //         hour: "2-digit",
    //         minute: "2-digit",
    //       }),
    //       methodPay: "Transfer Bank",
    //     }
    //   );

    //   res.json({ msg: "Pembayaran berhasil!" });
    // }
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
