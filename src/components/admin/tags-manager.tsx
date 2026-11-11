"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PencilSimple, Plus, Tag as TagIcon, Trash, X } from "@phosphor-icons/react";
import { api } from "@/lib/client-api";

type Tag = { id: string; name: string; slug: string; count: number };

export function TagsManager({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startAdd() {
    setEditing(null);
    setName("");
    setSlug("");
    setError("");
    setOpen(true);
  }

  function startEdit(tag: Tag) {
    setEditing(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setError("");
    setOpen(true);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api(`/api/admin/tags/${editing.id}`, { method: "PATCH", body: JSON.stringify({ name, slug }) });
      } else {
        await api("/api/admin/tags", { method: "POST", body: JSON.stringify({ name, slug }) });
      }
      setOpen(false);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove(tag: Tag) {
    if (!window.confirm(`删除标签「${tag.name}」？`)) return;
    try {
      await api(`/api/admin/tags/${tag.id}`, { method: "DELETE" });
      router.refresh();
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "删除失败");
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="group flex items-center gap-2 rounded-full border border-line bg-surface/25 py-1.5 pl-4 pr-2">
            <TagIcon size={13} className="text-faint" />
            <span className="text-sm text-ink">{tag.name}</span>
            <span className="font-display text-[10px] text-faint">{tag.count}</span>
            <button type="button" onClick={() => startEdit(tag)} className="grid size-6 place-items-center rounded-full text-faint hover:text-accent" aria-label="编辑标签">
              <PencilSimple size={12} />
            </button>
            <button type="button" onClick={() => remove(tag)} className="grid size-6 place-items-center rounded-full text-faint hover:text-red-400" aria-label="删除标签">
              <Trash size={12} />
            </button>
          </div>
        ))}
        <button type="button" onClick={startAdd} className="flex items-center gap-1.5 rounded-full border border-dashed border-line px-4 py-1.5 text-sm text-faint transition-colors hover:border-accent hover:text-accent">
          <Plus size={14} /> 新标签
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative w-full max-w-sm rounded-2xl border border-line bg-[var(--surface-solid)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-cn text-xl text-ink">{editing ? "编辑标签" : "新建标签"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-faint hover:text-ink" aria-label="关闭">
                <X size={17} />
              </button>
            </div>
            <label className="mt-5 block">
              <span className="mb-1.5 block text-[10px] text-faint">名称</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required autoFocus className="field" placeholder="例如：动画" />
            </label>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-[10px] text-faint">Slug（留空自动生成）</span>
              <input value={slug} onChange={(event) => setSlug(event.target.value)} className="field font-mono text-xs" placeholder="anime" />
            </label>
            {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost !py-2.5 text-xs">取消</button>
              <button type="submit" disabled={saving} className="btn btn-primary !py-2.5 text-xs">{saving ? "保存中…" : "保存"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}