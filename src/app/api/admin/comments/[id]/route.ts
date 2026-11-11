import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !["pending", "approved", "spam"].includes(body.status)) {
    return Response.json({ error: "状态无效" }, { status: 400 });
  }
  const [row] = await client`UPDATE comments SET status = ${body.status} WHERE id = ${id} RETURNING id`;
  if (!row) return Response.json({ error: "评论不存在" }, { status: 404 });
  return Response.json({ ok: true });
}

export async function DELETE(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  await client`DELETE FROM comments WHERE id = ${id}`;
  return Response.json({ ok: true });
}