import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sendContact } from "../api/contact.js";
import { adminRoutes } from "../api/_lib/admin-routes.js";
import { handleRegistrationStatus } from "../api/_lib/registration-status.js";
import { handleMembers } from "../api/_lib/members-public.js";

const fail = (res) => () => {
  res.statusCode = 500;
  res.end();
};

function adminApi() {
  return {
    name: "admin-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === "/dashboard/admin69") req.url = "/dashboard/admin69/";
        next();
      });
      server.middlewares.use("/api/registration-status", (req, res) => {
        handleRegistrationStatus(req, res).catch(fail(res));
      });
      server.middlewares.use("/api/members", (req, res) => {
        handleMembers(req, res).catch(fail(res));
      });
      server.middlewares.use("/api/admin69", (req, res) => {
        const route = adminRoutes[req.url.split("?")[0]];
        if (!route) {
          res.statusCode = 404;
          res.end();
          return;
        }
        Promise.resolve(route(req, res)).catch(fail(res));
      });
    },
  };
}

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
  process.env.ADMIN_PASSWORD_HASH ||= env.ADMIN_PASSWORD_HASH || "";
  process.env.ADMIN_SESSION_SECRET ||= env.ADMIN_SESSION_SECRET || "";
  process.env.MONGODB_URI ||= env.MONGODB_URI || "";
  process.env.MONGODB_DB ||= env.MONGODB_DB || "";
  for (const key of ["CLOUDINARY_URL", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) {
    process.env[key] ||= env[key] || "";
  }
  return {
    plugins: [react(), contactApi(), adminApi()],
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL("./index.html", import.meta.url)),
          dashboard: fileURLToPath(new URL("./dashboard/admin69/index.html", import.meta.url)),
        },
      },
    },
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
