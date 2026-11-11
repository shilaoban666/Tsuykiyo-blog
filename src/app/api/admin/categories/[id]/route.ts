import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { categorySchema } from "@/lib/validation";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "请填写分类名称" }, { status: 400 });

  let slug = slugify(parsed.data.slug || parsed.data.name);
  const [conflict] = await client`SELECT id FROM categories WHERE slug = ${slug} AND id <> ${id}`;
  if (conflict) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const [row] = await client`
    UPDATE categories SET
      slug = ${slug}, name = ${parsed.data.name}, description = ${parsed.data.description || null},
      accent = ${parsed.data.accent}, sort = ${parsed.data.sort}
    WHERE id = ${id} RETURNING *
  `;
  if (!row) return Response.json({ error: "分类不存在" }, { status: 404 });
  return Response.json({ ok: true, category: row });
}

export async function DELETE(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  await client`DELETE FROM categories WHERE id = ${id}`;
  return Response.json({ ok: true });
}