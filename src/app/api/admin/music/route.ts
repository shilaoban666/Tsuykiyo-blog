import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { listAllMusicTracks } from "@/lib/music";
import { musicSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  return Response.json({ tracks: await listAllMusicTracks() });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = musicSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "请填写歌名并选择音频文件" }, { status: 400 });
  const data = parsed.data;
  const [row] = await client`
    INSERT INTO music (title, artist, album, cover_url, audio_url, sort, enabled)
    VALUES (${data.title}, ${data.artist || null}, ${data.album || null}, ${data.coverUrl || null},
      ${data.audioUrl}, ${data.sort}, ${data.enabled})
    RETURNING *
  `;
  return Response.json({ ok: true, track: row }, { status: 201 });
}