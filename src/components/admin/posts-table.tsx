"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DotsThree, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import { StatusBadge } from "./admin-page-header";
import { api } from "@/lib/client-api";
import type { AdminPost } from "@/lib/admin";
import { formatShortDate } from "@/lib/utils";

export function PostsTable({ posts }: { posts: AdminPost[] }) {
  const router = useRouter();
  const [menu, setMenu] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(post: AdminPost) {
    setBusy(post.id);
    try {
      await api(`/api/admin/posts/${post.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: post.status === "published" ? "draft" : "published" }),
      });
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "操作失败");
    } finally {
      setBusy(null);
      setMenu(null);
    }
  }

  async function remove(post: AdminPost) {
    if (!window.confirm(`确定删除《${post.title}》？这个操作不可撤销。`)) return;
    setBusy(post.id);
    try {
      await api(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "删除失败");
    } finally {
      setBusy(null);
      setMenu(null);
    }
  }

  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
        <p className="font-serif-cn text-lg text-muted">这里还没有文章</p>
        <p className="mt-2 text-xs text-faint">写一点什么，让它不再空着。</p>
        <Link href="/admin/posts/new" className="btn btn-primary mt-6">开始写作</Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/20">
      <div className="hidden grid-cols-[minmax(0,1fr)_110px_90px_90px_110px_44px] items-center gap-4 border-b border-line px-5 py-3 text-[10px] tracking-[0.14em] text-faint md:grid">
        <span>标题</span><span>分类</span><span>状态</span><span>阅读</span><span>更新时间</span><span />
      </div>
      <div className="divide-y divide-line">
        {posts.map((post) => (
          <div key={post.id} className="group relative grid gap-3 px-4 py-4 transition-colors hover:bg-ink/[0.02] md:grid-cols-[minmax(0,1fr)_110px_90px_90px_110px_44px] md:items-center md:gap-4 md:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="hidden h-12 w-16 shrink-0 overflow-hidden rounded-md border border-line bg-surface sm:block">
                {post.coverUrl ? <img src={post.coverUrl} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[radial-gradient(circle_at_70%_20%,rgba(255,122,146,.2),transparent_50%)]" />}
              </div>
              <div className="min-w-0">
                <Link href={`/admin/posts/${post.id}`} className="block truncate text-sm font-medium text-ink transition-colors group-hover:text-accent">
                  {post.title}
                </Link>
                <p className="mt-0.5 truncate text-[10px] text-faint">
                  /{post.slug}
                  {post.featured ? " · 精选" : ""}{post.pinned ? " · 置顶" : ""}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 md:hidden">
                  <StatusBadge status={post.status} />
                  <span className="text-[10px] text-faint">{post.categoryName ?? "未分类"}</span>
                </div>
              </div>
            </div>
            <span className="hidden truncate text-xs text-muted md:block">{post.categoryName ?? "—"}</span>
            <span className="hidden md:block"><StatusBadge status={post.status} /></span>
            <span className="hidden text-xs text-faint md:block">{post.views}</span>
            <span className="hidden text-[11px] text-faint md:block">{formatShortDate(post.updatedAt)}</span>
            <div className="absolute right-3 top-3 md:static md:right-auto md:top-auto">
              <button
                type="button"
                onClick={() => setMenu(menu === post.id ? null : post.id)}
                disabled={busy === post.id}
                className="grid size-8 place-items-center rounded-full text-faint transition-colors hover:bg-ink/5 hover:text-ink"
                aria-label="文章操作"
              >
                <DotsThree size={20} weight="bold" />
              </button>
              {menu === post.id ? (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                  <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl border border-line bg-[var(--surface-solid)] shadow-xl">
                    <Link href={`/admin/posts/${post.id}`} className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted hover:bg-ink/5 hover:text-ink">
                      <PencilSimple size={14} /> 编辑
                    </Link>
                    {post.status === "published" ? (
                      <Link href={`/posts/${post.slug}`} target="_blank" className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted hover:bg-ink/5 hover:text-ink">
                        <Eye size={14} /> 查看
                      </Link>
                    ) : null}
                    <button type="button" onClick={() => toggle(post)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-muted hover:bg-ink/5 hover:text-ink">
                      {post.status === "published" ? "转为草稿" : "立即发布"}
                    </button>
                    <button type="button" onClick={() => remove(post)} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-red-400 hover:bg-red-400/5">
                      <Trash size={14} /> 删除
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}