"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  MusicNotes,
  Pause,
  PencilSimple,
  Play,
  Plus,
  Trash,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { api } from "@/lib/client-api";
import type { MusicTrack } from "@/lib/music";

const emptyForm = {
  title: "",
  artist: "",
  album: "",
  coverUrl: "",
  audioUrl: "",
  sort: 0,
  enabled: true,
};

export function MusicManager({ tracks }: { tracks: MusicTrack[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MusicTrack | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"audio" | "cover" | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewRef = useRef<HTMLAudioElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function startAdd() {
    setEditing(null);
    setForm({ ...emptyForm, sort: tracks.length });
    setError("");
    setOpen(true);
  }

  function startEdit(track: MusicTrack) {
    setEditing(track);
    setForm({
      title: track.title,
      artist: track.artist ?? "",
      album: track.album ?? "",
      coverUrl: track.coverUrl ?? "",
      audioUrl: track.audioUrl,
      sort: track.sort,
      enabled: track.enabled,
    });
    setError("");
    setOpen(true);
  }

  async function upload(file: File, kind: "audio" | "cover") {
    setUploading(kind);
    setError("");
    try {
      if (kind === "audio") {
        const body = new FormData();
        body.append("file", file);
        const data = await api<{ url: string }>("/api/admin/music/upload", { method: "POST", body });
        setForm((current) => ({ ...current, audioUrl: data.url }));
      } else {
        const body = new FormData();
        body.append("file", file);
        const data = await api<{ media: { url: string } }>("/api/admin/media", { method: "POST", body });
        setForm((current) => ({ ...current, coverUrl: data.media.url }));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "上传失败");
    } finally {
      setUploading(null);
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api(`/api/admin/music/${editing.id}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await api("/api/admin/music", { method: "POST", body: JSON.stringify(form) });
      }
      setOpen(false);
      setPreview(null);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(track: MusicTrack) {
    try {
      await api(`/api/admin/music/${track.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: track.title,
          artist: track.artist ?? "",
          album: track.album ?? "",
          coverUrl: track.coverUrl ?? "",
          audioUrl: track.audioUrl,
          sort: track.sort,
          enabled: !track.enabled,
        }),
      });
      router.refresh();
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "操作失败");
    }
  }

  async function remove(track: MusicTrack) {
    if (!window.confirm(`删除歌曲「${track.title}」？音频文件不会被自动删除。`)) return;
    try {
      await api(`/api/admin/music/${track.id}`, { method: "DELETE" });
      router.refresh();
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "删除失败");
    }
  }

  function playPreview() {
    const audio = previewRef.current;
    if (!audio || !preview) return;
    if (audio.paused) {
      void audio.play().then(() => setPreviewPlaying(true)).catch(() => setPreviewPlaying(false));
    } else {
      audio.pause();
      setPreviewPlaying(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface/20">
        {tracks.map((track, index) => (
          <div key={track.id} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-0 sm:px-5">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
              {track.coverUrl ? (
                <img src={track.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-faint"><MusicNotes size={18} /></div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm text-ink">{track.title}</p>
                {!track.enabled ? <span className="rounded-full border border-line px-1.5 py-0.5 text-[9px] text-faint">已停用</span> : null}
              </div>
              <p className="mt-0.5 truncate text-[10px] text-faint">
                {track.artist || "未知歌手"} · {track.album || "未分类"} · 排序 {track.sort}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPreview(track.audioUrl);
                setPreviewPlaying(false);
              }}
              className="grid size-8 place-items-center rounded-full border border-line text-faint transition-colors hover:border-accent hover:text-accent"
              aria-label="试听"
            >
              <Play size={13} weight="fill" />
            </button>
            <button
              type="button"
              onClick={() => toggle(track)}
              className={`hidden rounded-full border px-2.5 py-1 text-[10px] transition-colors sm:inline-flex ${track.enabled ? "border-emerald-400/30 text-emerald-300" : "border-line text-faint"}`}
            >
              {track.enabled ? "启用中" : "已停用"}
            </button>
            <button type="button" onClick={() => startEdit(track)} className="grid size-8 place-items-center rounded-full text-faint hover:text-accent" aria-label="编辑">
              <PencilSimple size={14} />
            </button>
            <button type="button" onClick={() => remove(track)} className="grid size-8 place-items-center rounded-full text-faint hover:text-red-400" aria-label="删除">
              <Trash size={14} />
            </button>
            <span className="hidden w-6 text-right font-display text-xs text-faint sm:block">{String(index + 1).padStart(2, "0")}</span>
          </div>
        ))}
        {!tracks.length ? (
          <div className="px-6 py-16 text-center">
            <MusicNotes size={28} weight="light" className="mx-auto text-faint" />
            <p className="mt-3 font-serif-cn text-lg text-muted">歌单还是空的</p>
            <p className="mt-1 text-xs text-faint">上传一首你喜欢的音乐，它会出现在前台右下角。</p>
          </div>
        ) : null}
      </div>

      <button type="button" onClick={startAdd} className="btn btn-primary mt-5">
        <Plus size={15} weight="bold" /> 添加歌曲
      </button>

      {preview ? (
        <div className="fixed bottom-5 left-1/2 z-[90] flex w-[min(92vw,520px)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-line bg-[var(--surface-solid)]/95 p-3 shadow-2xl backdrop-blur-xl">
          <button type="button" onClick={playPreview} className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-[var(--accent-ink)]" aria-label={previewPlaying ? "暂停试听" : "播放试听"}>
            {previewPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          </button>
          <audio
            ref={previewRef}
            src={preview}
            onEnded={() => setPreviewPlaying(false)}
            onPause={() => setPreviewPlaying(false)}
            onPlay={() => setPreviewPlaying(true)}
            className="min-w-0 flex-1"
            controls
          />
          <button type="button" onClick={() => { previewRef.current?.pause(); setPreview(null); }} className="grid size-8 place-items-center rounded-full text-faint hover:text-ink" aria-label="关闭试听">
            <X size={16} />
          </button>
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-[var(--surface-solid)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-cn text-xl text-ink">{editing ? "编辑歌曲" : "添加歌曲"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-faint hover:text-ink" aria-label="关闭">
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] text-faint">歌名 *</span>
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required className="field" placeholder="例如：夏の終わり" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] text-faint">歌手</span>
                  <input value={form.artist} onChange={(event) => setForm({ ...form, artist: event.target.value })} className="field" placeholder="歌手名" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] text-faint">专辑</span>
                  <input value={form.album} onChange={(event) => setForm({ ...form, album: event.target.value })} className="field" placeholder="专辑名" />
                </label>
              </div>

              <div>
                <span className="mb-1.5 block text-[10px] text-faint">音频 *</span>
                <div className="flex gap-2">
                  <input value={form.audioUrl} onChange={(event) => setForm({ ...form, audioUrl: event.target.value })} className="field font-mono text-[11px]" placeholder="上传音频或粘贴 URL" />
                  <button type="button" onClick={() => audioInputRef.current?.click()} disabled={uploading === "audio"} className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-faint hover:text-accent" aria-label="上传音频">
                    <UploadSimple size={15} />
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-faint">支持 MP3 / OGG / WAV / M4A / FLAC，最大 30MB。{uploading === "audio" ? "上传中…" : ""}</p>
                <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "audio"); event.target.value = ""; }} />
                {form.audioUrl ? (
                  <audio src={form.audioUrl} controls className="mt-2 w-full" preload="metadata" />
                ) : null}
              </div>

              <div>
                <span className="mb-1.5 block text-[10px] text-faint">封面</span>
                <div className="flex items-center gap-3">
                  <div className="size-14 shrink-0 overflow-hidden rounded-lg border border-line bg-surface">
                    {form.coverUrl ? <img src={form.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-faint"><MusicNotes size={18} /></div>}
                  </div>
                  <input value={form.coverUrl} onChange={(event) => setForm({ ...form, coverUrl: event.target.value })} className="field font-mono text-[11px]" placeholder="封面 URL 或上传" />
                  <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploading === "cover"} className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-faint hover:text-accent" aria-label="上传封面">
                    <UploadSimple size={15} />
                  </button>
                  <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file, "cover"); event.target.value = ""; }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] text-faint">排序</span>
                  <input type="number" min={0} max={999} value={form.sort} onChange={(event) => setForm({ ...form, sort: Number(event.target.value) })} className="field" />
                </label>
                <label className="flex items-end gap-2 pb-2 text-xs text-muted">
                  <input type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} className="size-4 accent-[var(--accent)]" />
                  前台显示
                </label>
              </div>
            </div>

            {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost !py-2.5 text-xs">取消</button>
              <button type="submit" disabled={saving} className="btn btn-primary !py-2.5 text-xs">
                {saving ? "保存中…" : <><CheckCircle size={14} /> 保存歌曲</>}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}