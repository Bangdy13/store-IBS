import User from "@/models/User";
import jwt from "jsonwebtoken";

const auth = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ err: "Invalid authentication" });

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) return res.status(400).json({ err: "Invalid authentication" });

  const user = await User.findOne({ _id: decoded.id });
  return { id: user._id, role: user.role, root: user.root };
};

export default auth;
