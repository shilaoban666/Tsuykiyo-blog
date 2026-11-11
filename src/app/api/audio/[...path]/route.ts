import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".flac": "audio/flac",
};

function resolveAudio(segments: string[]) {
  const root = path.resolve(process.cwd(), "data", "music");
  const target = path.resolve(root, ...segments);
  if (!target.startsWith(root + path.sep)) return null;
  return { root, target };
}

function parseRange(range: string | null, size: number) {
  if (!range) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) return null;
  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) return null;
  return { start, end: Math.min(end, size - 1) };
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const resolved = resolveAudio(segments);
  if (!resolved) return new Response("Not found", { status: 404 });

  try {
    const info = await stat(resolved.target);
    const type = MIME[path.extname(resolved.target).toLowerCase()] ?? "application/octet-stream";
    const range = parseRange(request.headers.get("range"), info.size);
    const buffer = await readFile(resolved.target);

    if (range) {
      const chunk = buffer.subarray(range.start, range.end + 1);
      return new Response(new Uint8Array(chunk), {
        status: 206,
        headers: {
          "Content-Type": type,
          "Content-Length": String(chunk.length),
          "Content-Range": `bytes ${range.start}-${range.end}/${info.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

export async function HEAD(_request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await context.params;
  const resolved = resolveAudio(segments);
  if (!resolved) return new Response(null, { status: 404 });
  try {
    const info = await stat(resolved.target);
    const type = MIME[path.extname(resolved.target).toLowerCase()] ?? "application/octet-stream";
    return new Response(null, {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}