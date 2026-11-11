import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !["draft", "published"].includes(body.status)) {
    return Response.json({ error: "状态无效" }, { status: 400 });
  }
  const [row] = await client`
    UPDATE posts SET status = ${body.status},
      published_at = ${body.status === "published" ? new Date().toISOString() : null},
      updated_at = now()
    WHERE id = ${id} RETURNING id, status
  `;
  if (!row) return Response.json({ error: "文章不存在" }, { status: 404 });
  return Response.json({ ok: true, post: row });
}