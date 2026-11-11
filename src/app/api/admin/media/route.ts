import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { listAdminMedia } from "@/lib/admin";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });
  return Response.json({ media: await listAdminMedia() });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "请先登录" }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "上传格式无效" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "没有找到文件" }, { status: 400 });
  if (file.size > MAX_SIZE) return Response.json({ error: "图片不能超过 8MB" }, { status: 413 });
  const extension = TYPES[file.type];
  if (!extension) return Response.json({ error: "仅支持 JPG、PNG、WebP、GIF、AVIF 或 SVG" }, { status: 415 });

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const filename = `${randomUUID()}.${extension}`;
  const relative = `${year}/${month}/${filename}`;
  const uploadRoot = path.join(process.cwd(), "data", "uploads");
  const directory = path.join(uploadRoot, year, month);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

  const url = `/api/uploads/${relative}`;
  const [row] = await client`
    INSERT INTO media (filename, original_name, mime_type, size, url)
    VALUES (${filename}, ${file.name.slice(0, 200)}, ${file.type}, ${file.size}, ${url})
    RETURNING *
  `;
  return Response.json({ ok: true, media: row }, { status: 201 });
}