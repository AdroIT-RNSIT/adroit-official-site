import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["workshop", "seminar", "hackathon", "meetup", "other"],
      default: "other",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Event", eventSchema);
