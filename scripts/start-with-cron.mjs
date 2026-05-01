#!/usr/bin/env node
/**
 * Production startup script. Master scope §17 + §8B.
 *
 * The server bundle (`dist/index.js`) registers all node-cron schedules from
 * `server/lib/cron-runner.ts` after `server.listen()` resolves. There is no
 * separate cron process — node-cron runs inside the web service so that all
 * env, DB, and Bunny credentials are inherited.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = join(__dirname, "..", "dist", "index.js");
const child = spawn(process.execPath, [entry], {
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" },
});
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
