import db from "@/lib/mongoDB";
import Product from "@/models/Product";

/* eslint-disable import/no-anonymous-default-export */

db.connect();
export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.findById(id);

    if (!product) return res.status(400).json({ err: "Produk ini tidak ada." });
    res.json({
      product,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
