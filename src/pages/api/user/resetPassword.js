/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import User from "@/models/User";
import bcrypt from "bcrypt";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await resetPassword(req, res);
      break;
  }
};

const resetPassword = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 12);

    await User.findOneAndUpdate({ _id: result.id }, { password: passwordHash });

    res.json({ msg: "Update profile berhasil" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
