import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { tagSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const rows = await client`SELECT * FROM tags ORDER BY name ASC`;
  return Response.json({ tags: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "请填写标签名称" }, { status: 400 });

  let slug = slugify(parsed.data.slug || parsed.data.name);
  const [conflict] = await client`SELECT id FROM tags WHERE slug = ${slug}`;
  if (conflict) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const [row] = await client`
    INSERT INTO tags (slug, name) VALUES (${slug}, ${parsed.data.name}) RETURNING *
  `;
  return Response.json({ ok: true, tag: row }, { status: 201 });
}