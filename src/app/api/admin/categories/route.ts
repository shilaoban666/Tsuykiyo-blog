import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { categorySchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const rows = await client`SELECT * FROM categories ORDER BY sort ASC, name ASC`;
  return Response.json({ categories: rows });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "请填写分类名称" }, { status: 400 });

  let slug = slugify(parsed.data.slug || parsed.data.name);
  const [conflict] = await client`SELECT id FROM categories WHERE slug = ${slug}`;
  if (conflict) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const [row] = await client`
    INSERT INTO categories (slug, name, description, accent, sort)
    VALUES (${slug}, ${parsed.data.name}, ${parsed.data.description || null}, ${parsed.data.accent}, ${parsed.data.sort})
    RETURNING *
  `;
  return Response.json({ ok: true, category: row }, { status: 201 });
}