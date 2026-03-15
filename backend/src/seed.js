/**
 * Seed script — creates the admin user in the database.
 */

import "dotenv/config";
import { auth, db } from "./lib/auth.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@adroit.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function seed() {
  console.log("🌱 Seeding admin user...\n");

  try {
    const existing = await auth.api
      .signInEmail({
        body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
      })
      .catch(() => null);

    if (existing) {
      // Ensure the admin account has the correct role + approval flag
      try {
        const adminId = existing.user?.id || existing.id || existing._id;
        await db.collection("user").updateOne(
          { _id: adminId },
          { $set: { role: "admin", approved: true } }
        );
      } catch (e) {
        console.warn("Could not enforce admin role/approval in DB:", e.message || e);
      }

      console.log("✅ Admin user already exists — ensured role=admin & approved=true.\n");
      const adminId = existing.user?.id || existing.id || existing._id;
      console.log(`   Admin ID: ${adminId}`);
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      process.exit(0);
    }
  } catch (e) {
    console.error("Seed check failed:", e);
  }

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        role: "admin",
        approved: true,
      },
    });

    console.log("✅ Admin user created successfully!\n");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name:     ${ADMIN_NAME}`);
    console.log(`   Role:     admin`);
    console.log(`   ID:       ${result.user?.id || "created"}`);
  } catch (error) {
    if (
      error.message?.includes("already exists") ||
      error.body?.message?.includes("already exists")
    ) {
      console.log("✅ Admin user already exists. Skipping.");
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
    } else {
      console.error("❌ Failed to create admin user:", error.message || error);
    }
  }

  process.exit(0);
}

seed();
