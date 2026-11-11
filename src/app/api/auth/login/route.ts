import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/auth";
import { fail, getClientIp, isSameOrigin, rateLimit, readJson } from "@/lib/api";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return fail("来源无效", 403);
  const ip = getClientIp(request);
  const limited = rateLimit(`login:${ip}`, 8, 15 * 60_000);
  if (!limited.ok) return fail("登录尝试过多，请 15 分钟后再试。", 429);

  const body = await readJson<unknown>(request);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("请输入有效的邮箱与密码。");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()))
    .limit(1);
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return fail("邮箱或密码不正确。", 401);
  }

  await createSession(user.id, request.headers.get("user-agent"));
  return NextResponse.json({ ok: true, user: { name: user.name, email: user.email } });
}