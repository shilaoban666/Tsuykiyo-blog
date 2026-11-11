import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { musicSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = musicSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "歌曲信息不完整" }, { status: 400 });
  const data = parsed.data;
  const [row] = await client`
    UPDATE music SET
      title = ${data.title}, artist = ${data.artist || null}, album = ${data.album || null},
      cover_url = ${data.coverUrl || null}, audio_url = ${data.audioUrl}, sort = ${data.sort},
      enabled = ${data.enabled}
    WHERE id = ${id}
    RETURNING *
  `;
  if (!row) return Response.json({ error: "歌曲不存在" }, { status: 404 });
  return Response.json({ ok: true, track: row });
}

export async function DELETE(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  await client`DELETE FROM music WHERE id = ${id}`;
  return Response.json({ ok: true });
}