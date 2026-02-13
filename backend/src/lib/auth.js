import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/club-members";

const client = new MongoClient(MONGO_URI);
await client.connect();
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  secret:
    process.env.BETTER_AUTH_SECRET || "super-secret-key-change-in-production",
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
      approved: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});

export { db };
