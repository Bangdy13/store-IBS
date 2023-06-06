/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import User from "@/models/User";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updatedRoles(req, res);
      break;
    case "DELETE":
      await deletedUsers(req, res);
      break;
  }
};

const updatedRoles = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin" || !result.root)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { role } = req.body;

    await User.findOneAndUpdate({ _id: id }, { role });
    res.json({ msg: "Update user berhasil!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const deletedUsers = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin" || !result.root)
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await User.findByIdAndDelete(id);
    res.json({ msg: "Delete user berhasil!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
