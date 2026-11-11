import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";

const root = process.cwd();
const envPath = resolve(root, ".env.local");
const examplePath = resolve(root, ".env.example");

if (!existsSync(envPath)) {
  const example = readFileSync(examplePath, "utf8");
  const secret = randomBytes(32).toString("hex");
  const env = example.replace("replace-with-a-long-random-string", secret);
  writeFileSync(envPath, env, "utf8");
  console.log("✓ 已生成 .env.local（包含随机 AUTH_SECRET）");
} else {
  console.log("✓ 已检测到 .env.local");
}

const env = {};
for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
  if (match) env[match[1]] = match[2];
}

mkdirSync(resolve(root, "data", "uploads"), { recursive: true });
mkdirSync(resolve(root, "data", "music"), { recursive: true });

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor < 20) {
  console.error(`✗ Node.js 版本过低：当前 ${process.versions.node}，需要 20.9 或以上。`);
  process.exit(1);
}

if (!env.DATABASE_URL) {
  console.error("✗ .env.local 中缺少 DATABASE_URL。");
  process.exit(1);
}

console.log("✓ Node.js " + process.versions.node);
console.log("✓ 数据目录 data/uploads 与 data/music 已就绪");
console.log("");
console.log("  管理员邮箱：" + (env.ADMIN_EMAIL || "admin@tsukiyo.local"));
console.log("  初始密码：" + (env.ADMIN_PASSWORD || "tsukiyo2026"));
console.log("  数据库：" + env.DATABASE_URL.replace(/:\/\/([^:]+):[^@]+@/, "://$1:****@"));
console.log("");
console.log("下一步：npm run db:setup && npm run db:seed");