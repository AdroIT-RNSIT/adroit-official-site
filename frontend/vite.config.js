import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { sendContact } from "../api/contact.js";
import { adminRoutes } from "../api/_lib/admin-routes.js";
import { handleRegistrationStatus } from "../api/_lib/registration-status.js";
import { handleMembers } from "../api/_lib/members-public.js";
import { handleUiDesign } from "../api/_lib/ui-design.js";
import { handleRecruitment, routeFromUrl } from "../api/_lib/recruitment.js";

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
      server.middlewares.use("/api/ui-design", (req, res) => {
        handleUiDesign(req, res).catch(fail(res));
      });
      server.middlewares.use("/api/recruitment", (req, res) => {
        handleRecruitment(req, res, routeFromUrl(req.originalUrl)).catch(fail(res));
      });
      server.middlewares.use("/api/admin69", (req, res) => {
        if (req.url.startsWith("/recruitment")) {
          handleRecruitment(req, res, routeFromUrl(req.originalUrl)).catch(fail(res));
          return;
        }
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

// The app waits for the active design's CSS before its first render; preloading it from
// index.html starts that request alongside the JS instead of after it.
function preloadDesignCss() {
  return {
    name: "preload-design-css",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (ctx.path !== "/index.html" || !ctx.bundle) return html;
        const urls = {};
        for (const file of Object.values(ctx.bundle)) {
          if (file.type !== "asset" || !file.fileName.endsWith(".css")) continue;
          for (const source of file.originalFileNames || []) {
            const match = source.match(/ui-designs\/([a-z][a-z0-9-]*)\/\1\.css$/);
            if (match) urls[match[1]] = `/${file.fileName}`;
          }
        }
        if (!Object.keys(urls).length) return html;
        const script = `<script>(function(){var u=${JSON.stringify(urls)}[document.documentElement.getAttribute("data-ui")];if(!u)return;var l=document.createElement("link");l.rel="preload";l.as="style";l.crossOrigin="";l.href=u;document.head.appendChild(l);})();</script>`;
        const end = html.indexOf("</script>");
        return end === -1 ? html : html.slice(0, end + 9) + script + html.slice(end + 9);
      },
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
  for (const key of [
    "CLOUDINARY_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "TURNSTILE_SITE_KEY",
    "TURNSTILE_SECRET_KEY",
    "RECRUITMENT_RATE_SECRET",
  ]) {
    process.env[key] ||= env[key] || "";
  }
  return {
    plugins: [react(), contactApi(), adminApi(), preloadDesignCss()],
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
