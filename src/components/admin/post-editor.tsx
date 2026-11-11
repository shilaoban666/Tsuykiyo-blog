"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Code,
  Eye,
  Image as ImageIcon,
  LinkSimple,
  ListBullets,
  PencilSimple,
  Quotes,
  TextB,
  TextHTwo,
  TextItalic,
  UploadSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { MarkdownContent } from "@/components/markdown-content";
import { StatusBadge } from "./admin-page-header";
import { api } from "@/lib/client-api";
import { readingMinutes } from "@/lib/utils";

type EditorTag = { id: string; name: string };
type EditorCategory = { id: string; name: string };

export type EditorPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  categoryId: string | null;
  status: string;
  featured: boolean;
  pinned: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  sourcePlatform: string | null;
  sourceViews: number;
  sourceLikes: number;
  sourceComments: number;
  tags: EditorTag[];
};

type FormState = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  categoryId: string;
  status: "draft" | "published";
  featured: boolean;
  pinned: boolean;
  seoTitle: string;
  seoDescription: string;
};

export function PostEditor({
  post,
  categories,
  allTags,
}: {
  post: EditorPost | null;
  categories: EditorCategory[];
  allTags: EditorTag[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    subtitle: post?.subtitle ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverUrl: post?.coverUrl ?? "",
    categoryId: post?.categoryId ?? "",
    status: (post?.status as "draft" | "published") ?? "draft",
    featured: post?.featured ?? false,
    pinned: post?.pinned ?? false,
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
  });
  const [tagIds, setTagIds] = useState<string[]>(post?.tags.map((tag) => tag.id) ?? []);
  const [sourceMetrics, setSourceMetrics] = useState({
    views: post?.sourceViews ?? 0,
    likes: post?.sourceLikes ?? 0,
    comments: post?.sourceComments ?? 0,
  });
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);
  const initial = useRef(JSON.stringify({ form, tagIds }));
  const dirty = JSON.stringify({ form, tagIds }) !== initial.current;

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save(form.status);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, tagIds]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function insert(before: string, after = "", placeholder = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.content.slice(start, end) || placeholder;
    const next = `${form.content.slice(0, start)}${before}${selected}${after}${form.content.slice(end)}`;
    update("content", next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function prefixLine(prefix: string, placeholder = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const before = form.content.slice(0, start);
    const lineStart = before.lastIndexOf("\n") + 1;
    const next = `${form.content.slice(0, lineStart)}${prefix}${form.content.slice(lineStart) || placeholder}`;
    update("content", next);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    });
  }

  async function upload(file: File, mode: "cover" | "inline") {
    const body = new FormData();
    body.append("file", file);
    try {
      const data = await api<{ media: { url: string; originalName: string } }>("/api/admin/media", { method: "POST", body });
      if (mode === "cover") {
        update("coverUrl", data.media.url);
      } else {
        insert(`![${data.media.originalName}](${data.media.url})`);
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "上传失败" });
    }
  }

  async function save(nextStatus?: "draft" | "published") {
    if (saving) return;
    if (!form.title.trim()) {
      setMessage({ type: "error", text: "先给文章起一个标题。" });
      return;
    }
    setSaving(true);
    setMessage(null);
    const status = nextStatus ?? form.status;
    const payload = {
      ...form,
      status,
      categoryId: form.categoryId || null,
      tagIds,
      sourceViews: sourceMetrics.views,
      sourceLikes: sourceMetrics.likes,
      sourceComments: sourceMetrics.comments,
    };
    try {
      if (post) {
        await api(`/api/admin/posts/${post.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        setForm((current) => ({ ...current, status }));
        initial.current = JSON.stringify({ form: { ...form, status }, tagIds });
        setMessage({ type: "ok", text: status === "published" ? "已更新并发布。" : "草稿已保存。" });
        router.refresh();
      } else {
        const data = await api<{ id: string }>("/api/admin/posts", { method: "POST", body: JSON.stringify(payload) });
        initial.current = JSON.stringify({ form: { ...form, status }, tagIds });
        router.replace(`/admin/posts/${data.id}`);
        router.refresh();
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "保存失败" });
    } finally {
      setSaving(false);
    }
  }

  const minutes = useMemo(() => readingMinutes(form.content), [form.content]);
  const words = form.content.replace(/\s/g, "").length;

  return (
    <div className="-mx-4 -my-6 sm:-mx-8 sm:-my-10">
      <div className="sticky top-0 z-30 border-b border-line bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/admin/posts" className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink" aria-label="返回文章列表">
            <ArrowLeft size={17} />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-faint">{post ? "编辑文章" : "新文章"}</span>
              <StatusBadge status={form.status} />
              {dirty ? <span className="flex items-center gap-1 text-[10px] text-amber-300"><span className="size-1 rounded-full bg-amber-400" /> 未保存</span> : null}
            </div>
            <p className="truncate text-[11px] text-faint">{form.title || "无题"}</p>
          </div>
          {message ? (
            <span className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] sm:flex ${message.type === "ok" ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300" : "border-red-400/20 bg-red-400/5 text-red-300"}`}>
              {message.type === "ok" ? <CheckCircle size={13} /> : <WarningCircle size={13} />} {message.text}
            </span>
          ) : null}
          <button type="button" onClick={() => save()} disabled={saving} className="btn btn-ghost !py-2.5 text-xs">保存</button>
          <button type="button" onClick={() => save("published")} disabled={saving} className="btn btn-primary !py-2.5 text-xs">
            {saving ? "保存中…" : form.status === "published" ? "更新发布" : "发布"}
          </button>
        </div>
        {message ? (
          <p className={`px-4 pb-3 text-[11px] sm:hidden ${message.type === "ok" ? "text-emerald-300" : "text-red-300"}`}>{message.text}</p>
        ) : null}
      </div>

      <div className="grid gap-6 px-4 py-6 sm:px-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <div className="rounded-2xl border border-line bg-surface/20 p-5 sm:p-7">
            <input
              value={form.title}
              onChange={(event) => {
                update("title", event.target.value);
                if (!slugTouched) update("slug", "");
              }}
              placeholder="无题"
              className="w-full border-0 bg-transparent font-serif-cn text-3xl font-semibold leading-snug text-ink outline-none placeholder:text-faint/40 sm:text-4xl"
              aria-label="文章标题"
            />
            <input
              value={form.subtitle}
              onChange={(event) => update("subtitle", event.target.value)}
              placeholder="副标题（可选）"
              className="mt-3 w-full border-0 bg-transparent font-serif-cn text-base text-muted outline-none placeholder:text-faint/40"
              aria-label="副标题"
            />
            <div className="mt-5 flex items-center gap-1 border-t border-line pt-4 text-[11px] text-faint">
              <span>/posts/</span>
              <input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  update("slug", event.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
                placeholder="自动生成"
                className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-muted outline-none placeholder:text-faint/50"
                aria-label="文章 slug"
              />
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface/20">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setTab("write")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] ${tab === "write" ? "bg-ink/5 text-ink" : "text-faint hover:text-muted"}`}>
                  <PencilSimple size={13} /> 写作
                </button>
                <button type="button" onClick={() => setTab("preview")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] ${tab === "preview" ? "bg-ink/5 text-ink" : "text-faint hover:text-muted"}`}>
                  <Eye size={13} /> 预览
                </button>
              </div>
              <div className="flex items-center gap-0.5">
                {[
                  { icon: TextHTwo, title: "二级标题", action: () => prefixLine("## ", "标题") },
                  { icon: TextB, title: "加粗", action: () => insert("**", "**", "文字") },
                  { icon: TextItalic, title: "斜体", action: () => insert("*", "*", "文字") },
                  { icon: Quotes, title: "引用", action: () => prefixLine("> ", "引用") },
                  { icon: ListBullets, title: "列表", action: () => prefixLine("- ", "列表项") },
                  { icon: Code, title: "代码", action: () => insert("`", "`", "code") },
                  { icon: LinkSimple, title: "链接", action: () => insert("[", "](https://)", "链接文字") },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.title} type="button" onClick={item.action} title={item.title} className="grid size-8 place-items-center rounded-md text-faint transition-colors hover:bg-ink/5 hover:text-ink">
                      <Icon size={16} />
                    </button>
                  );
                })}
                <button type="button" onClick={() => inlineImageRef.current?.click()} title="插入图片" className="grid size-8 place-items-center rounded-md text-faint transition-colors hover:bg-ink/5 hover:text-ink">
                  <ImageIcon size={16} />
                </button>
                <input
                  ref={inlineImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(file, "inline");
                    event.target.value = "";
                  }}
                />
              </div>
            </div>

            {tab === "write" ? (
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(event) => update("content", event.target.value)}
                placeholder={"## 从这里开始\n\n写下第一句话。支持 Markdown、代码块、表格与图片。"}
                className="min-h-[58vh] w-full resize-y border-0 bg-transparent px-5 py-5 font-mono text-[13px] leading-7 text-ink outline-none placeholder:text-faint/40 sm:px-7"
                spellCheck={false}
              />
            ) : (
              <div className="min-h-[58vh] px-5 py-6 sm:px-7">
                {form.content ? <MarkdownContent content={form.content} /> : <p className="text-sm text-faint">还没有内容可以预览。</p>}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-line px-4 py-2 text-[10px] text-faint">
              <span>Markdown · Ctrl/Cmd + S 保存</span>
              <span>{words} 字 · 约 {minutes} 分钟</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-surface/20 p-5">
            <p className="text-[10px] tracking-[0.16em] text-faint">摘要 / EXCERPT</p>
            <textarea
              value={form.excerpt}
              onChange={(event) => update("excerpt", event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="用一两句话概括这篇文章。会出现在列表与分享卡片中。"
              className="mt-2 w-full resize-y bg-transparent text-sm leading-6 text-ink outline-none placeholder:text-faint/40"
            />
            <p className="mt-1 text-right text-[10px] text-faint">{form.excerpt.length} / 500</p>
          </div>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-line bg-surface/25 p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-[10px] tracking-[0.2em] text-faint">PUBLISHING</p>
              <StatusBadge status={form.status} />
            </div>
            <div className="mt-4 space-y-2">
              <button type="button" onClick={() => save("draft")} disabled={saving} className="btn btn-ghost w-full !py-2.5 text-xs">
                {form.status === "published" ? "转为草稿" : "保存草稿"}
              </button>
              <button type="button" onClick={() => save("published")} disabled={saving} className="btn btn-primary w-full !py-2.5 text-xs">
                {form.status === "published" ? "更新发布" : "发布文章"}
              </button>
            </div>
            <p className="mt-3 text-[10px] leading-5 text-faint">草稿不会出现在站点上。发布后可以在前台看到。</p>
          </section>

          <section className="rounded-2xl border border-line bg-surface/25 p-5">
            <p className="font-display text-[10px] tracking-[0.2em] text-faint">COVER</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-line bg-surface">
              {form.coverUrl ? (
                <div className="relative">
                  <img src={form.coverUrl} alt="封面预览" className="aspect-[3/2] w-full object-cover" />
                  <button type="button" onClick={() => update("coverUrl", "")} className="absolute right-2 top-2 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] text-white backdrop-blur">移除</button>
                </div>
              ) : (
                <button type="button" onClick={() => coverInputRef.current?.click()} className="flex aspect-[3/2] w-full flex-col items-center justify-center gap-2 text-faint transition-colors hover:text-accent">
                  <UploadSimple size={22} weight="light" />
                  <span className="text-[10px]">上传封面</span>
                </button>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={form.coverUrl} onChange={(event) => update("coverUrl", event.target.value)} placeholder="或粘贴图片 URL" className="field !py-2 text-[11px]" />
              <button type="button" onClick={() => coverInputRef.current?.click()} className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-faint hover:text-accent" aria-label="上传封面">
                <UploadSimple size={15} />
              </button>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file, "cover");
                event.target.value = "";
              }}
            />
          </section>

          {post?.sourcePlatform ? (
            <section className="rounded-2xl border border-line bg-surface/25 p-5">
              <p className="font-display text-[10px] tracking-[0.2em] text-faint">SOURCE DATA · {post.sourcePlatform.toUpperCase()}</p>
              <p className="mt-2 text-[10px] leading-5 text-faint">手动填写原平台后台的真实数据。微信不公开数据，请从公众号后台抄录；不要填写虚假数字。</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <label className="block">
                  <span className="mb-1 block text-[9px] text-faint">阅读</span>
                  <input type="number" min={0} value={sourceMetrics.views} onChange={(event) => setSourceMetrics((current) => ({ ...current, views: Number(event.target.value) }))} className="field !px-2 !py-2 text-xs" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[9px] text-faint">点赞</span>
                  <input type="number" min={0} value={sourceMetrics.likes} onChange={(event) => setSourceMetrics((current) => ({ ...current, likes: Number(event.target.value) }))} className="field !px-2 !py-2 text-xs" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[9px] text-faint">评论</span>
                  <input type="number" min={0} value={sourceMetrics.comments} onChange={(event) => setSourceMetrics((current) => ({ ...current, comments: Number(event.target.value) }))} className="field !px-2 !py-2 text-xs" />
                </label>
              </div>
            </section>
          ) : null}

          <section className="rounded-2xl border border-line bg-surface/25 p-5">
            <p className="font-display text-[10px] tracking-[0.2em] text-faint">ORGANIZE</p>
            <label className="mt-3 block">
              <span className="mb-1.5 block text-[10px] text-faint">分类</span>
              <select value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} className="field !py-2 text-xs">
                <option value="">未分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-4">
              <span className="mb-2 block text-[10px] text-faint">标签</span>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => {
                  const active = tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => setTagIds((current) => (active ? current.filter((id) => id !== tag.id) : [...current, tag.id]))}
                      className={`rounded-full border px-2.5 py-1 text-[10px] transition-colors ${active ? "border-accent bg-accent/10 text-accent" : "border-line text-faint hover:text-muted"}`}
                    >
                      #{tag.name}
                    </button>
                  );
                })}
                {!allTags.length ? <Link href="/admin/tags" className="text-[10px] text-accent">先创建标签</Link> : null}
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-line pt-4">
              <label className="flex cursor-pointer items-center justify-between text-xs text-muted">
                设为精选
                <input type="checkbox" checked={form.featured} onChange={(event) => update("featured", event.target.checked)} className="size-4 accent-[var(--accent)]" />
              </label>
              <label className="flex cursor-pointer items-center justify-between text-xs text-muted">
                置顶文章
                <input type="checkbox" checked={form.pinned} onChange={(event) => update("pinned", event.target.checked)} className="size-4 accent-[var(--accent)]" />
              </label>
            </div>
          </section>

          <details className="rounded-2xl border border-line bg-surface/25 p-5">
            <summary className="cursor-pointer list-none font-display text-[10px] tracking-[0.2em] text-faint">SEO / 分享卡片</summary>
            <div className="mt-4 space-y-3">
              <input value={form.seoTitle} onChange={(event) => update("seoTitle", event.target.value)} placeholder="SEO 标题（默认文章标题）" className="field text-xs" />
              <textarea value={form.seoDescription} onChange={(event) => update("seoDescription", event.target.value)} rows={3} placeholder="SEO 描述（默认摘要）" className="field resize-y text-xs" />
            </div>
          </details>
        </aside>
      </div>
    </div>
  );
}