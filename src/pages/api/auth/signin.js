/* eslint-disable import/no-anonymous-default-export */
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "@/utils/generateToken";
import db from "@/lib/mongoDB";
import User from "@/models/User";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await signin(req, res);
      break;
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ err: "Email ini tidak ada." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ err: "Kata sandi salah." });

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    res.json({
      msg: "Berhasil login akun",
      refresh_token,
      access_token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
