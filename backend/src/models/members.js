import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "Member" },
    email: { type: String, unique: true, sparse: true, trim: true },
    domain: {
      type: String,
      enum: ["ml", "cc", "cy", "da"],
      default: "ml",
    },
    year: { type: String },
    department: { type: String, default: "CSE" },
    bio: { type: String, maxlength: 500 },
    linkedin: { type: String, trim: true },
    github: { type: String, trim: true },
    imagePublicId: { type: String },
    joinedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Member", memberSchema);
