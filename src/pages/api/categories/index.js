/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import Category from "@/models/Category";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createCategory(req, res);
      break;
    case "GET":
      await getCategory(req, res);
      break;
  }
};

const createCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { name } = req.body;
    if (!name)
      return res.status(400).json({ err: "Nama kategori wajib di isi !." });

    const newCategory = new Category({ name });

    await newCategory.save();
    res.json({ msg: "Kategori berhasil dibuat!", newCategory });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
