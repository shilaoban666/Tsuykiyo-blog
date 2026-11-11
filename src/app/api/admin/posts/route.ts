import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { getAdminPost, listAdminPosts } from "@/lib/admin";
import { readingMinutes, slugify } from "@/lib/utils";
import { postSchema } from "@/lib/validation";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  return Response.json({ posts: await listAdminPosts() });
}

async function uniqueSlug(base: string, excludeId?: string) {
  let candidate = base;
  for (let index = 1; index < 50; index += 1) {
    const [row] = await client`
      SELECT id FROM posts WHERE slug = ${candidate} ${excludeId ? client`AND id <> ${excludeId}` : client``} LIMIT 1
    `;
    if (!row) return candidate;
    candidate = `${base}-${index + 1}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式无效" }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "请检查标题等必填项", details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;
  const slug = await uniqueSlug(data.slug ? slugify(data.slug) : slugify(data.title));

  try {
    const id = await client.begin(async (tx) => {
      const [row] = await tx`
        INSERT INTO posts (
          slug, title, subtitle, excerpt, content, cover_url, category_id, status,
          featured, pinned, reading_minutes, seo_title, seo_description, published_at,
          source_views, source_likes, source_comments
        ) VALUES (
          ${slug}, ${data.title}, ${data.subtitle || null}, ${data.excerpt || null}, ${data.content},
          ${data.coverUrl || null}, ${data.categoryId || null}, ${data.status}, ${data.featured},
          ${data.pinned}, ${readingMinutes(data.content)}, ${data.seoTitle || null},
          ${data.seoDescription || null}, ${data.status === "published" ? new Date().toISOString() : null},
          ${data.sourceViews}, ${data.sourceLikes}, ${data.sourceComments}
        ) RETURNING id
      `;
      for (const tagId of data.tagIds) {
        await tx`INSERT INTO post_tags (post_id, tag_id) VALUES (${row.id}, ${tagId}) ON CONFLICT DO NOTHING`;
      }
      return row.id as string;
    });
    return Response.json({ ok: true, id, post: await getAdminPost(id) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "保存失败，请检查分类或标签是否有效。" }, { status: 500 });
  }
}