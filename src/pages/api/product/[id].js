/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import Product from "@/models/Product";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
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

const updateProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const {
      name,
      image,
      price,
      inStock,
      description,
      descriptionSize,
      category,
    } = req.body;

    if (
      (!name ||
        !price ||
        !inStock ||
        !description ||
        !descriptionSize ||
        category === "all",
      image.length === 0)
    )
      return res
        .status(400)
        .json({ err: "Mohon isikan semua form dengan benar !." });

    await Product.findOneAndUpdate(
      { _id: id },
      {
        name: name.toLowerCase(),
        image,
        price,
        inStock,
        description,
        descriptionSize,
        category,
      }
    );

    res.json({ msg: "Update produk berhasil" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Product.findByIdAndDelete(id);
    res.json({ msg: "Produk berhasil di hapus" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
