import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  email: { type: String, unique: true },
  joinedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Member", memberSchema);
