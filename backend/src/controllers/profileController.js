import UserProfile from "../models/userProfile.js";
import { db } from "../lib/auth.js";
import bcrypt from "bcryptjs";

// GET /api/users/profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find or create profile
        let profile = await UserProfile.findOne({ userId });

        if (!profile) {
            // Create a new profile seeded from the auth user data
            profile = await UserProfile.create({
                userId,
                name: req.user.name || "",
                email: req.user.email || "",
                role: req.user.role || "Member",
            });
        }

        res.json(profile);
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Failed to fetch profile" });
    }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, bio, domain, year, department, linkedin, github, phone, imagePublicId } =
            req.body;

        const profile = await UserProfile.findOneAndUpdate(
            { userId },
            {
                $set: {
                    name,
                    bio,
                    domain,
                    year,
                    department,
                    linkedin,
                    github,
                    phone,
                    imagePublicId,
                },
            },
            { new: true, upsert: true, runValidators: true }
        );

        // Also update name in better-auth user collection
        if (name) {
            try {
                await db.collection("user").updateOne(
                    { _id: userId },
                    { $set: { name } }
                );
            } catch (e) {
                // Non-critical — profile update still succeeded
                console.warn("Could not sync name to auth user:", e.message);
            }
        }

        res.json(profile);
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
};

// PUT /api/users/password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Both current and new password are required" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "New password must be at least 8 characters" });
        }

        // Get the user's account from the better-auth account collection
        const account = await db.collection("account").findOne({
            userId,
            providerId: "credential",
        });

        if (!account) {
            return res
                .status(400)
                .json({ message: "Password change not available for social login accounts" });
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, account.password);
        if (!isValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection("account").updateOne(
            { userId, providerId: "credential" },
            { $set: { password: hashedPassword } }
        );

        res.json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Failed to change password" });
    }
};

// PUT /api/users/settings
export const updateSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { settings } = req.body;

        if (!settings) {
            return res.status(400).json({ message: "Settings data is required" });
        }

        const profile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: { settings } },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({ message: "Settings updated successfully", settings: profile.settings });
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ message: "Failed to update settings" });
    }
};
