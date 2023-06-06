/* eslint-disable import/no-anonymous-default-export */
import jwt from "jsonwebtoken";
import { createAccessToken } from "@/utils/generateToken";
import db from "@/lib/mongoDB";
import User from "@/models/User";

db.connect();
export default async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token)
      return res.status(400).json({ err: "Silahkan login sekarang!" });

    const result = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
    if (!result)
      return res
        .status(400)
        .json({ err: "Token anda salah atau telah kedaluwarsa." });

    const user = await User.findById(result.id);
    if (!user) return res.status(400).json({ err: "Email tidak ada." });
    const access_token = createAccessToken({ id: user._id });
    res.json({
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
