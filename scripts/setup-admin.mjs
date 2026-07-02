import { readFileSync, writeFileSync, existsSync } from "fs";
import { createHash } from "crypto";

if (!existsSync(".env")) {
  console.error("Missing .env — copy .env.example to .env and set ADMIN_PASSWORD.");
  process.exit(1);
}

const env = readFileSync(".env", "utf8");
const match = env.match(/^ADMIN_PASSWORD=(.+)$/m);

if (!match || !match[1].trim() || match[1].trim() === "change-me-to-something-strong") {
  console.error("Set a real ADMIN_PASSWORD in .env first.");
  process.exit(1);
}

const hash = createHash("sha256").update(match[1].trim()).digest("hex");

writeFileSync("admin-secrets.js", `window.ADMIN_PASSWORD_HASH = "${hash}";\n`);
console.log("admin-secrets.js generated. Commit and push it.");
