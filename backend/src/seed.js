/**
 * Seed script — creates the admin user in the database.
 */

import "dotenv/config";
import { auth } from "./lib/auth.js";

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
      console.log("✅ Admin user already exists. Skipping.\n");
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: ${ADMIN_PASSWORD}`);
      process.exit(0);
    }
  } catch {}

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
