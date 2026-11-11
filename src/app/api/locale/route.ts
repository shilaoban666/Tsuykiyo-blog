import { NextResponse } from "next/server";
import { isSameOrigin } from "@/lib/api";
import { LOCALE_COOKIE, isLocale } from "@/i18n/config";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const body = (await request.json().catch(() => null)) as { locale?: string } | null;
  if (!isLocale(body?.locale)) return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });

  const response = NextResponse.json({ ok: true, locale: body.locale });
  response.cookies.set(LOCALE_COOKIE, body.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}