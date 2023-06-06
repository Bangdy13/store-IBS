/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import User from "@/models/User";
import validation from "@/utils/validation";
import bcrypt from "bcrypt";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await signup(req, res);
      break;
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, cf_password } = req.body;

    const errMsg = validation(name, email, password, cf_password);
    if (errMsg) return res.status(400).json({ err: errMsg });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ err: "Email ini sudah ada." });

    const passwordHash = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password: passwordHash,
      cf_password,
    });

    await newUser.save();

    res.json({ msg: "Berhasil membuat akun !" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
