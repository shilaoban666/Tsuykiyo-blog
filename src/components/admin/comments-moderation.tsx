"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChatCircle, Prohibit, Trash } from "@phosphor-icons/react";
import { StatusBadge } from "./admin-page-header";
import { api } from "@/lib/client-api";
import { formatShortDate } from "@/lib/utils";

type AdminComment = {
  id: string;
  authorName: string;
  authorEmail: string | null;
  content: string;
  status: string;
  createdAt: string;
  postTitle: string;
  postSlug: string;
};

export function CommentsModeration({ comments }: { comments: AdminComment[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    try {
      await api(`/api/admin/comments/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "操作失败");
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("确定删除这条评论？")) return;
    setBusy(id);
    try {
      await api(`/api/admin/comments/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "删除失败");
    } finally {
      setBusy(null);
    }
  }

  if (!comments.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
        <ChatCircle size={30} weight="light" className="mx-auto text-faint" />
        <p className="mt-4 font-serif-cn text-lg text-muted">这里很安静</p>
        <p className="mt-2 text-xs text-faint">还没有符合筛选条件的评论。</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article key={comment.id} className={`rounded-2xl border p-5 transition-colors ${comment.status === "pending" ? "border-amber-400/20 bg-amber-400/[0.03]" : "border-line bg-surface/20"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-line bg-surface/60 font-display text-xs text-accent">
                {comment.authorName.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm text-ink">{comment.authorName}</p>
                <p className="mt-0.5 flex items-center gap-2 text-[10px] text-faint">
                  {comment.authorEmail ? <span>{comment.authorEmail}</span> : null}
                  <span>{formatShortDate(comment.createdAt)}</span>
                </p>
              </div>
            </div>
            <StatusBadge status={comment.status} />
          </div>

          <p className="mt-4 whitespace-pre-wrap text-[13px] leading-7 text-muted">{comment.content}</p>
          <p className="mt-3 text-[10px] text-faint">
            评论于 <a href={`/posts/${comment.postSlug}`} target="_blank" className="text-accent hover:underline">《{comment.postTitle}》</a>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            {comment.status !== "approved" ? (
              <button type="button" disabled={busy === comment.id} onClick={() => setStatus(comment.id, "approved")} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 px-3 py-1.5 text-[11px] text-emerald-300 transition-colors hover:bg-emerald-400/10">
                <Check size={13} /> 通过
              </button>
            ) : null}
            {comment.status !== "pending" ? (
              <button type="button" disabled={busy === comment.id} onClick={() => setStatus(comment.id, "pending")} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-muted transition-colors hover:text-ink">
                待审
              </button>
            ) : null}
            {comment.status !== "spam" ? (
              <button type="button" disabled={busy === comment.id} onClick={() => setStatus(comment.id, "spam")} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[11px] text-muted transition-colors hover:text-amber-300">
                <Prohibit size={13} /> 标记垃圾
              </button>
            ) : null}
            <button type="button" disabled={busy === comment.id} onClick={() => remove(comment.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-red-400/20 px-3 py-1.5 text-[11px] text-red-400 transition-colors hover:bg-red-400/5">
              <Trash size={13} /> 删除
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}