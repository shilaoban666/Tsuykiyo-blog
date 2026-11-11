import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSessionUser } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_SIZE = 30 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/flac": "flac",
};

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
  if (!(file instanceof File)) return Response.json({ error: "没有找到音频文件" }, { status: 400 });
  if (file.size > MAX_SIZE) return Response.json({ error: "音频不能超过 30MB" }, { status: 413 });
  const extension = TYPES[file.type] ?? file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["mp3", "ogg", "wav", "m4a", "flac"].includes(extension)) {
    return Response.json({ error: "仅支持 MP3、OGG、WAV、M4A、FLAC" }, { status: 415 });
  }

  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const filename = `${randomUUID()}.${extension}`;
  const relative = `${year}/${month}/${filename}`;
  const directory = path.join(process.cwd(), "data", "music", year, month);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));

  return Response.json({ ok: true, url: `/api/audio/${relative}` }, { status: 201 });
}