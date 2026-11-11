import { NextResponse } from "next/server";
import { likePost } from "@/lib/posts";
import { fail, isSameOrigin, rateLimit, getClientIp } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  if (!isSameOrigin(request)) return fail("来源无效", 403);
  const { slug } = await context.params;
  const limited = rateLimit(`like:${getClientIp(request)}`, 20, 60_000);
  if (!limited.ok) return fail("慢一点，月亮还在。", 429);
  const likes = await likePost(slug);
  if (likes === null) return fail("文章不存在", 404);
  return NextResponse.json({ likes });
}