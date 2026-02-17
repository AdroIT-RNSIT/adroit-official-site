import { db } from "../lib/auth.js";
import crypto from "crypto";
import { ObjectId } from "mongodb";

const usersCollection = db.collection("user");

/**
 * Encrypt API key using AES-256-GCM
 */
function encryptApiKey(apiKey, encryptionKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "hex"),
    iv
  );

  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  // Return: iv.authTag.encrypted (all hex encoded)
  return `${iv.toString("hex")}.${authTag.toString("hex")}.${encrypted}`;
}

/**
 * Decrypt API key
 */
function decryptApiKey(encryptedData, encryptionKey) {
  const [ivHex, authTagHex, encryptedHex] = encryptedData.split(".");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(encryptionKey, "hex"),
    iv
  );
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

/**
 * Get encryption key from environment
 */
function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be a 32-byte hex string (64 characters). Generate with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    );
  }
  return key;
}

/**
 * Save or update user's Gemini API key
 */
export const saveApiKey = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { apiKey } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - no user ID" });
    }

    if (!apiKey || typeof apiKey !== "string") {
      return res.status(400).json({ error: "API key is required" });
    }

    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch (err) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const encryptionKey = getEncryptionKey();
    const encryptedKey = encryptApiKey(apiKey, encryptionKey);

    // Update user with encrypted API key
    const result = await usersCollection.updateOne(
      { _id: userObjectId },
      {
        $set: {
          geminiApiKey: encryptedKey,
          geminiApiKeyUpdatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found in database" });
    }

    res.json({
      status: "success",
      message: "API key saved securely",
    });
  } catch (error) {
    console.error("❌ Error saving API key:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get user's Gemini API key (decrypted)
 * Should only be called from backend (not exposed to frontend)
 */
export const getApiKey = async (userId) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user || !user.geminiApiKey) {
      return null;
    }

    const encryptionKey = getEncryptionKey();
    const decryptedKey = decryptApiKey(user.geminiApiKey, encryptionKey);

    return decryptedKey;
  } catch (error) {
    console.error("Error decrypting API key:", error);
    return null;
  }
};

/**
 * Check if user has API key set
 */
export const hasApiKey = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { geminiApiKey: 1 } }
    );

    res.json({
      hasApiKey: !!user?.geminiApiKey,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete user's API key
 */
export const deleteApiKey = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $unset: { geminiApiKey: 1 },
        $set: { geminiApiKeyDeletedAt: new Date() },
      }
    );

    res.json({
      status: "success",
      message: "API key deleted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
