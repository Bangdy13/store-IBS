/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import Category from "@/models/Category";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      await deleteCategory(req, res);
      break;
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { name } = req.body;

    const newCategory = await Category.findOneAndUpdate({ _id: id }, { name });

    res.json({
      msg: "Update kategori berhasil!",
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Category.findByIdAndDelete(id);
    res.json({ msg: "Hapus kategori berhasil!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
