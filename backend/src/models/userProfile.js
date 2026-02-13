import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        domain: {
            type: String,
            enum: ["", "ml", "cc", "cy", "da"],
            default: "",
        },
        role: { type: String, default: "Member" },
        bio: { type: String, maxlength: 500, default: "" },
        year: { type: String, default: "" },
        department: { type: String, default: "CSE" },
        linkedin: { type: String, trim: true, default: "" },
        github: { type: String, trim: true, default: "" },
        phone: { type: String, trim: true, default: "" },
        imagePublicId: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
        settings: {
            emailNotifications: { type: Boolean, default: true },
            eventReminders: { type: Boolean, default: true },
            resourceUpdates: { type: Boolean, default: true },
            profileVisibility: {
                type: String,
                enum: ["public", "members", "private"],
                default: "members",
            },
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("UserProfile", userProfileSchema);
