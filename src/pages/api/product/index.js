/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import Product from "@/models/Product";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProducts(req, res);
      break;
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: "successfully",
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
