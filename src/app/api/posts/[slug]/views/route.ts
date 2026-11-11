import { NextResponse } from "next/server";
import { client } from "@/db";
import { getClientIp, rateLimit } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const limited = rateLimit(`view:${getClientIp(_request)}`, 60, 60_000);
  if (!limited.ok) return NextResponse.json({ ok: false }, { status: 429 });
  await client`UPDATE posts SET views = views + 1 WHERE slug = ${slug} AND status = 'published'`;
  return NextResponse.json({ ok: true });
}