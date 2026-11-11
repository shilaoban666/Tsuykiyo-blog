import { NextResponse } from "next/server";
import { client } from "@/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [row] = await client`SELECT 1 AS ok`;
    return NextResponse.json({
      ok: row?.ok === 1,
      service: "tsukiyo-blog",
      database: "up",
      time: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ ok: false, service: "tsukiyo-blog", database: "down" }, { status: 503 });
  }
}