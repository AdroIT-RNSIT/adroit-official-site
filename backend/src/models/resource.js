import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "article",
        "video",
        "course",
        "book",
        "documentation",
        "tool",
        "paper",
        "cheatSheet",
        "other",
      ],
      default: "other",
    },
    domain: {
      type: String,
      enum: ["ml", "cc", "cy", "da"],
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    tags: [{ type: String, trim: true }],
    author: { type: String, trim: true },
    views: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
resourceSchema.index({ title: "text", description: "text" });

export default mongoose.model("Resource", resourceSchema);
