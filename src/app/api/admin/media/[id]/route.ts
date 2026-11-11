import { unlink } from "node:fs/promises";
import path from "node:path";
import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const [row] = await client`SELECT url FROM media WHERE id = ${id} LIMIT 1`;
  if (!row) return Response.json({ error: "文件不存在" }, { status: 404 });
  const relative = String(row.url).replace(/^\/api\/uploads\//, "");
  const target = path.resolve(process.cwd(), "data", "uploads", relative);
  const root = path.resolve(process.cwd(), "data", "uploads");
  if (target.startsWith(root + path.sep)) {
    await unlink(target).catch(() => {});
  }
  await client`DELETE FROM media WHERE id = ${id}`;
  return Response.json({ ok: true });
}