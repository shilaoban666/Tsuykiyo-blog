"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderSimple, PencilSimple, Plus, Trash, X } from "@phosphor-icons/react";
import { api } from "@/lib/client-api";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  accent: string;
  sort: number;
  count: number;
};

const empty = { name: "", slug: "", description: "", accent: "#ff6b8a", sort: 0 };

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startAdd() {
    setEditing(null);
    setForm(empty);
    setError("");
    setOpen(true);
  }

  function startEdit(category: Category) {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      accent: category.accent,
      sort: category.sort,
    });
    setError("");
    setOpen(true);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api(`/api/admin/categories/${editing.id}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await api("/api/admin/categories", { method: "POST", body: JSON.stringify(form) });
      }
      setOpen(false);
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function remove(category: Category) {
    if (!window.confirm(`删除分类「${category.name}」？该分类下的文章会变成未分类。`)) return;
    try {
      await api(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      router.refresh();
    } catch (reason) {
      window.alert(reason instanceof Error ? reason.message : "删除失败");
    }
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="group relative overflow-hidden rounded-2xl border border-line bg-surface/20 p-5 transition-colors hover:border-[var(--line-strong)]">
            <div className="absolute -right-10 -top-10 size-28 rounded-full opacity-20 blur-2xl" style={{ background: category.accent }} />
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl border border-line" style={{ color: category.accent }}>
                  <FolderSimple size={19} weight="light" />
                </span>
                <div>
                  <p className="font-serif-cn text-lg text-ink">{category.name}</p>
                  <p className="font-mono text-[10px] text-faint">/{category.slug}</p>
                </div>
              </div>
              <span className="font-display text-2xl text-faint">{String(category.count).padStart(2, "0")}</span>
            </div>
            <p className="mt-4 line-clamp-2 min-h-10 text-xs leading-5 text-faint">{category.description || "没有描述"}</p>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[10px] text-faint">排序 {category.sort}</span>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => startEdit(category)} className="grid size-7 place-items-center rounded-full text-faint hover:text-accent" aria-label="编辑分类">
                  <PencilSimple size={14} />
                </button>
                <button type="button" onClick={() => remove(category)} className="grid size-7 place-items-center rounded-full text-faint hover:text-red-400" aria-label="删除分类">
                  <Trash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={startAdd} className="flex min-h-[190px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line text-faint transition-colors hover:border-accent hover:text-accent">
          <Plus size={22} weight="light" />
          <span className="text-xs">新建分类</span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative w-full max-w-md rounded-2xl border border-line bg-[var(--surface-solid)] p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-cn text-xl text-ink">{editing ? "编辑分类" : "新建分类"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-faint hover:text-ink" aria-label="关闭">
                <X size={17} />
              </button>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] text-faint">名称</span>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="field" placeholder="例如：夜色随笔" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] text-faint">Slug（留空自动生成）</span>
                <input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="field font-mono text-xs" placeholder="night-notes" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] text-faint">描述</span>
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={2} className="field resize-y" placeholder="一句话描述这个分类" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] text-faint">强调色</span>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} className="size-9 rounded-lg border border-line bg-transparent" />
                    <input value={form.accent} onChange={(event) => setForm({ ...form, accent: event.target.value })} className="field font-mono text-xs" />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] text-faint">排序</span>
                  <input type="number" min={0} max={999} value={form.sort} onChange={(event) => setForm({ ...form, sort: Number(event.target.value) })} className="field" />
                </label>
              </div>
            </div>
            {error ? <p className="mt-3 text-xs text-red-400">{error}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost !py-2.5 text-xs">取消</button>
              <button type="submit" disabled={saving} className="btn btn-primary !py-2.5 text-xs">{saving ? "保存中…" : "保存分类"}</button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}