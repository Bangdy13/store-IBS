/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import Product from "@/models/Product";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProducts(req, res);
      break;
    case "POST":
      await createProducts(req, res);
      break;
  }
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (queryObj.category !== "all")
      this.query.find({ category: queryObj.category });
    if (queryObj.name !== "all")
      this.query.find({ name: { $regex: queryObj.name } });

    this.query.find();
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 6;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const getProducts = async (req, res) => {
  try {
    const Features = new APIFeatures(Product.find(), req.query)
      .filtering()
      .sorting()
      .paginating();

    const products = await Features.query;
    res.json({
      status: "successfully",
      result: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const createProducts = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

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

    const newProduct = new Product({
      name: name.toLowerCase(),
      image,
      price,
      inStock,
      description,
      descriptionSize,
      category,
    });

    await newProduct.save();

    res.json({ msg: "Produk berhasil ditambahkan" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
