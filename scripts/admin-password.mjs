// Usage: npm run admin:password
// Prints ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET for Vercel / frontend/.env.
// The password itself is never printed or stored.
import { randomBytes } from "node:crypto";
import readline from "node:readline";
import { hashPassword, passwordProblems } from "../api/_lib/admin-auth.js";

function askHidden(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (text) => {
      if (!muted) rl.output.write(text);
    };
    rl.question(prompt, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted = true;
  });
}

async function readPiped() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8").split(/\r?\n/)[0];
}

let password;
if (process.stdin.isTTY) {
  password = await askHidden("New admin password: ");
  const again = await askHidden("Repeat password: ");
  if (password !== again) {
    console.error("Passwords don't match.");
    process.exit(1);
  }
} else {
  password = await readPiped();
}

const problems = passwordProblems(password);
if (problems.length) {
  console.error("Password is too weak:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const hash = await hashPassword(password);
console.log("\nAdd these as environment variables (Vercel > Settings > Environment Variables, and frontend/.env for local dev):\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
