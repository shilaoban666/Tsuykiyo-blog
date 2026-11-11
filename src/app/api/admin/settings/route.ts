import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  return Response.json({ settings: await getSettings() });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "设置内容格式不正确", details: parsed.error.flatten() }, { status: 400 });
  }
  await db
    .insert(siteSettings)
    .values({ key: "site", value: parsed.data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: parsed.data, updatedAt: new Date() },
    });
  return Response.json({ ok: true });
}