import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { getAdminPost } from "@/lib/admin";
import { readingMinutes, slugify } from "@/lib/utils";
import { postSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  const post = await getAdminPost(id);
  if (!post) return Response.json({ error: "文章不存在" }, { status: 404 });
  return Response.json({ post });
}

export async function PATCH(request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;

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

  const [existing] = await client`SELECT id, slug, published_at FROM posts WHERE id = ${id} LIMIT 1`;
  if (!existing) return Response.json({ error: "文章不存在" }, { status: 404 });

  let slug = data.slug ? slugify(data.slug) : existing.slug;
  if (slug !== existing.slug) {
    const [conflict] = await client`SELECT id FROM posts WHERE slug = ${slug} AND id <> ${id} LIMIT 1`;
    if (conflict) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  try {
    await client.begin(async (tx) => {
      await tx`
        UPDATE posts SET
          slug = ${slug},
          title = ${data.title},
          subtitle = ${data.subtitle || null},
          excerpt = ${data.excerpt || null},
          content = ${data.content},
          cover_url = ${data.coverUrl || null},
          category_id = ${data.categoryId || null},
          status = ${data.status},
          featured = ${data.featured},
          pinned = ${data.pinned},
          reading_minutes = ${readingMinutes(data.content)},
          seo_title = ${data.seoTitle || null},
          seo_description = ${data.seoDescription || null},
          source_views = ${data.sourceViews},
          source_likes = ${data.sourceLikes},
          source_comments = ${data.sourceComments},
          published_at = ${
            data.status === "published"
              ? existing.published_at instanceof Date
                ? existing.published_at.toISOString()
                : existing.published_at ?? new Date().toISOString()
              : null
          },
          updated_at = now()
        WHERE id = ${id}
      `;
      await tx`DELETE FROM post_tags WHERE post_id = ${id}`;
      for (const tagId of data.tagIds) {
        await tx`INSERT INTO post_tags (post_id, tag_id) VALUES (${id}, ${tagId}) ON CONFLICT DO NOTHING`;
      }
    });
    return Response.json({ ok: true, post: await getAdminPost(id) });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "保存失败，请检查分类或标签是否有效。" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const { id } = await context.params;
  await client`DELETE FROM posts WHERE id = ${id}`;
  return Response.json({ ok: true });
}