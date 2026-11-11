"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Images, Trash, UploadSimple } from "@phosphor-icons/react";
import { api } from "@/lib/client-api";
import { formatShortDate } from "@/lib/utils";

type Media = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export function MediaLibrary({ media }: { media: Media[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function upload(files: FileList | File[]) {
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        await api("/api/admin/media", { method: "POST", body });
      }
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function remove(item: Media) {
    if (!window.confirm(`删除图片「${item.originalName}」？`)) return;
    try {
      await api(`/api/admin/media/${item.id}`, { method: "DELETE" });
      router.refresh();
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "删除失败");
    }
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files.length) void upload(event.dataTransfer.files);
        }}
        className={`rounded-2xl border border-dashed p-8 text-center transition-colors ${dragging ? "border-accent bg-accent/5" : "border-line bg-surface/10"}`}
      >
        <div className="mx-auto grid size-14 place-items-center rounded-full border border-line text-muted">
          <Images size={24} weight="light" />
        </div>
        <p className="mt-4 font-serif-cn text-lg text-ink">把图片拖到这里</p>
        <p className="mt-1 text-[11px] text-faint">支持 JPG、PNG、WebP、GIF、AVIF、SVG，单张不超过 8MB</p>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="btn btn-primary mt-5 !py-2.5 text-xs">
          <UploadSimple size={15} /> {uploading ? "上传中…" : "选择图片"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) void upload(event.target.files);
            event.target.value = "";
          }}
        />
        {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {media.map((item) => (
          <div key={item.id} className="group overflow-hidden rounded-xl border border-line bg-surface/20">
            <div className="relative aspect-square overflow-hidden bg-surface">
              <img src={item.url} alt={item.originalName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 flex items-end justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => copy(item.url)} className="grid size-8 place-items-center rounded-full bg-black/60 text-white/80 backdrop-blur hover:text-white" aria-label="复制链接">
                  {copied === item.url ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button type="button" onClick={() => remove(item)} className="grid size-8 place-items-center rounded-full bg-black/60 text-white/80 backdrop-blur hover:text-red-300" aria-label="删除图片">
                  <Trash size={14} />
                </button>
              </div>
            </div>
            <div className="p-2.5">
              <p className="truncate text-[11px] text-ink">{item.originalName}</p>
              <p className="mt-0.5 text-[9px] text-faint">{(item.size / 1024).toFixed(0)} KB · {formatShortDate(item.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {!media.length ? <p className="mt-8 text-center text-sm text-faint">媒体库还是空的。上传第一张图片吧。</p> : null}
    </>
  );
}