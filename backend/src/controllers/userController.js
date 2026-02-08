import { ObjectId } from "mongodb";
import { db } from "../lib/auth.js";

export const getUsers = async (req, res) => {
  try {
    const users = await db
      .collection("user")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    const mapped = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "user",
      approved: u.approved ?? false,
      image: u.image || null,
      createdAt: u.createdAt,
    }));

    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleApproval = async (req, res) => {
  try {
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({ error: "'approved' must be a boolean" });
    }

    const result = await db
      .collection("user")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: { approved } },
        { returnDocument: "after" },
      );

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: result._id.toString(),
      name: result.name,
      email: result.email,
      role: result.role,
      approved: result.approved,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
