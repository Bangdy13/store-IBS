/* eslint-disable import/no-anonymous-default-export */
import db from "@/lib/mongoDB";
import auth from "@/middleware/auth";
import User from "@/models/User";

db.connect();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await updateInfo(req, res);
      break;
    case "GET":
      await getUsers(req, res);
      break;
  }
};

const updateInfo = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { name, avatar } = req.body;

    const newUser = await User.findOneAndUpdate(
      { _id: result.id },
      { name, avatar }
    );

    res.json({
      msg: "Update berhasil",
      user: {
        name,
        avatar,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ error: "Authentication not valid" });

    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
