import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
      }
    } catch {
      // optional
    }
  }
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("缺少 DATABASE_URL，请先创建 .env.local");
  process.exit(1);
}

const target = new URL(url);
const database = target.pathname.replace(/^\//, "");
const adminUrl = new URL(url);
adminUrl.pathname = "/postgres";

let sql;
try {
  sql = postgres(adminUrl.toString(), { max: 1, prepare: false });
  const rows = await sql`SELECT 1 FROM pg_database WHERE datname = ${database}`;
  if (rows.length === 0) {
    await sql.unsafe(`CREATE DATABASE "${database.replaceAll('"', '""')}" WITH ENCODING 'UTF8' TEMPLATE template0`);
    console.log(`✓ 已创建数据库 ${database}`);
  }
  await sql.end();
} catch (error) {
  console.error("无法连接 PostgreSQL 管理库：", error.message);
  console.error("请确认 PostgreSQL 已启动，且 DATABASE_URL 中的用户名和密码正确。");
  process.exit(1);
}

const db = postgres(url, { max: 1, prepare: false });
try {
  const migrationDir = resolve(process.cwd(), "db/migrations");
  const files = readdirSync(migrationDir).filter((name) => name.endsWith(".sql")).sort();
  for (const file of files) {
    const content = readFileSync(resolve(migrationDir, file), "utf8");
    await db.unsafe(content);
    console.log(`✓ 已应用 ${file}`);
  }
} catch (error) {
  console.error("数据库迁移失败：", error.message);
  process.exitCode = 1;
} finally {
  await db.end();
}