import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { fail, isSameOrigin, readJson } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/password";

export const runtime = "nodejs";

export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return fail("来源无效", 403);
  const sessionUser = await getSessionUser();
  if (!sessionUser) return fail("请先登录", 401);

  const body = await readJson<{ currentPassword?: string; newPassword?: string; name?: string }>(request);
  if (!body) return fail("请求格式无效");

  const [user] = await db.select().from(users).where(eq(users.id, sessionUser.id)).limit(1);
  if (!user) return fail("账号不存在", 404);

  if (body.newPassword) {
    if (body.newPassword.length < 8) return fail("新密码至少 8 位。");
    if (!body.currentPassword || !(await verifyPassword(body.currentPassword, user.passwordHash))) {
      return fail("当前密码不正确。", 401);
    }
  }

  await db
    .update(users)
    .set({
      name: body.name?.trim() || user.name,
      passwordHash: body.newPassword ? await hashPassword(body.newPassword) : user.passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return Response.json({ ok: true });
}