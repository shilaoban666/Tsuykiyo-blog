import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { client } from "@/db";
import { fail, getClientIp, isSameOrigin, rateLimit, readJson } from "@/lib/api";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";

const schema = z.object({
  authorName: z.string().trim().min(1).max(40),
  authorEmail: z.string().trim().email().max(120).optional().or(z.literal("")),
  authorWebsite: z.string().trim().max(200).optional().or(z.literal("")),
  content: z.string().trim().min(2).max(1200),
  parentId: z.string().uuid().nullable().optional(),
  websiteHoneypot: z.string().optional(),
});

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  if (!isSameOrigin(request)) return fail("来源无效", 403);
  const { slug } = await context.params;
  const settings = await getSettings();
  if (!settings.commentsEnabled) return fail("评论暂时关闭", 403);

  const ip = getClientIp(request);
  const limited = rateLimit(`comment:${ip}`, 5, 10 * 60_000);
  if (!limited.ok) return fail("评论太频繁了，请稍后再来。", 429);

  const body = await readJson<unknown>(request);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("请检查称呼和评论内容。");
  if (parsed.data.websiteHoneypot) return NextResponse.json({ ok: true });

  const [post] = await client`
    SELECT id FROM posts WHERE slug = ${slug} AND status = 'published' LIMIT 1
  `;
  if (!post) return fail("文章不存在", 404);

  let parentId: string | null = null;
  if (parsed.data.parentId) {
    const [parent] = await client`
      SELECT id FROM comments WHERE id = ${parsed.data.parentId} AND post_id = ${post.id} AND status = 'approved' LIMIT 1
    `;
    parentId = parent?.id ?? null;
  }

  const ipHash = createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET || "tsukiyo"}`)
    .digest("hex")
    .slice(0, 32);

  await client`
    INSERT INTO comments (post_id, parent_id, author_name, author_email, author_website, content, status, ip_hash)
    VALUES (
      ${post.id}, ${parentId}, ${parsed.data.authorName}, ${parsed.data.authorEmail || null},
      ${parsed.data.authorWebsite || null}, ${parsed.data.content}, 'pending', ${ipHash}
    )
  `;
  return NextResponse.json({ ok: true, message: "评论已提交，审核后显示。" }, { status: 201 });
}