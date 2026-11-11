import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

export async function GET(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const root = path.resolve(process.cwd(), "data", "uploads");
  const target = path.resolve(root, ...segments);
  if (!target.startsWith(root + path.sep)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await readFile(target);
    const extension = path.extname(target).toLowerCase();
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": MIME[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}