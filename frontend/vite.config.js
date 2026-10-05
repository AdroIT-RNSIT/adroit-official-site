import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sendContact } from "../api/contact.js";

function contactApi() {
  return {
    name: "contact-api",
    configureServer(server) {
      server.middlewares.use("/api/contact", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: "Method not allowed" }));
          return;
        }
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", async () => {
          let body = {};
          try {
            body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
          } catch {
            body = {};
          }
          const result = await sendContact(body, req.socket?.remoteAddress || "local");
          res.statusCode = result.status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.body));
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  process.env.FORMSUBMIT_ENDPOINT = env.FORMSUBMIT_ENDPOINT;
  return {
    plugins: [react(), contactApi()],
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  };
});
