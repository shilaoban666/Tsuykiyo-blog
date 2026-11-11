"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowBendUpLeft, CheckCircle, ChatCircle, PaperPlaneTilt } from "@phosphor-icons/react";
import type { PublicComment } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import type { Messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";

type CommentNode = PublicComment & { children: CommentNode[] };

function buildTree(comments: PublicComment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];
  comments.forEach((comment) => map.set(comment.id, { ...comment, children: [] }));
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function CommentBody({ comment, locale }: { comment: PublicComment; locale: Locale }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-ink">{comment.authorName}</span>
        {comment.authorWebsite ? (
          <a href={comment.authorWebsite} target="_blank" rel="nofollow noreferrer" className="text-[10px] text-faint hover:text-accent">
            website
          </a>
        ) : null}
        <span className="text-[10px] text-faint">{formatDate(comment.createdAt, locale)}</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-[13px] leading-7 text-muted">{comment.content}</p>
    </div>
  );
}

function CommentItem({
  node,
  locale,
  messages,
  onReply,
}: {
  node: CommentNode;
  locale: Locale;
  messages: Messages;
  onReply: (comment: PublicComment) => void;
}) {
  return (
    <div className="border-b border-line py-6 last:border-0">
      <div className="flex gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-surface/50 font-display text-xs text-accent">
          {node.authorName.slice(0, 1).toUpperCase()}
        </div>
        <CommentBody comment={node} locale={locale} />
        <button
          type="button"
          onClick={() => onReply(node)}
          className="mt-1 inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-line px-2.5 text-[10px] text-faint transition-colors hover:border-accent hover:text-accent"
        >
          <ArrowBendUpLeft size={12} /> {messages["post.commentReply"]}
        </button>
      </div>
      {node.children.length ? (
        <div className="ml-12 mt-4 space-y-4 border-l border-line pl-5">
          {node.children.map((child) => (
            <div key={child.id} className="flex gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface/50 font-display text-[10px] text-cyan">
                {child.authorName.slice(0, 1).toUpperCase()}
              </div>
              <CommentBody comment={child} locale={locale} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Comments({
  postSlug,
  comments,
  enabled,
  locale,
  messages,
}: {
  postSlug: string;
  comments: PublicComment[];
  enabled: boolean;
  locale: Locale;
  messages: Messages;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");
  const [websiteHoneypot, setWebsiteHoneypot] = useState("");
  const [replyTo, setReplyTo] = useState<PublicComment | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const tree = useMemo(() => buildTree(comments), [comments]);

  function handleReply(comment: PublicComment) {
    setReplyTo(comment);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => formRef.current?.querySelector<HTMLTextAreaElement>("textarea")?.focus(), 300);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || content.trim().length < 2) {
      setError(messages["post.commentErrorFields"]);
      return;
    }
    setState("sending");
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(postSlug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: name,
          authorEmail: email,
          authorWebsite: website,
          content,
          parentId: replyTo?.id ?? null,
          websiteHoneypot,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error || messages["post.commentErrorSubmit"]);
        setState("error");
        return;
      }
      setState("sent");
      setContent("");
      setReplyTo(null);
    } catch {
      setError(messages["post.commentErrorNetwork"]);
      setState("error");
    }
  }

  return (
    <section id="comments" className="mt-16 border-t border-line pt-12">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-serif-cn text-2xl font-semibold text-ink">
          <ChatCircle size={22} weight="light" className="text-accent" />
          {messages["post.commentsTitle"]}
        </h2>
        <span className="font-display text-sm text-faint">{String(comments.length).padStart(2, "0")} {messages["post.commentReplies"]}</span>
      </div>

      {tree.length ? (
        <div className="mt-4">
          {tree.map((node) => (
            <CommentItem key={node.id} node={node} locale={locale} messages={messages} onReply={handleReply} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line px-6 py-10 text-center">
          <p className="text-sm text-muted">{messages["post.commentsEmpty"]}</p>
        </div>
      )}

      {enabled ? (
        <form ref={formRef} onSubmit={submit} className="mt-10 rounded-2xl border border-line bg-surface/25 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-serif-cn text-lg text-ink">
                {replyTo ? `${messages["post.commentReplyTo"]} ${replyTo.authorName}` : messages["post.commentFormTitle"]}
              </p>
              <p className="mt-1 text-[11px] text-faint">{messages["post.commentFormHint"]}</p>
            </div>
            {replyTo ? (
              <button type="button" onClick={() => setReplyTo(null)} className="text-[11px] text-faint transition-colors hover:text-accent">
                {messages["post.commentCancelReply"]}
              </button>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} placeholder={messages["post.commentName"]} className="field" aria-label={messages["post.commentName"]} />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" maxLength={120} placeholder={messages["post.commentEmail"]} className="field" aria-label={messages["post.commentEmail"]} />
            <input value={website} onChange={(event) => setWebsite(event.target.value)} maxLength={200} placeholder={messages["post.commentWebsite"]} className="field" aria-label={messages["post.commentWebsite"]} />
          </div>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={websiteHoneypot}
            onChange={(event) => setWebsiteHoneypot(event.target.value)}
            name="websiteHoneypot"
            className="sr-only"
            aria-hidden
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            maxLength={1200}
            rows={4}
            placeholder={messages["post.commentPlaceholder"]}
            className="field mt-3 resize-y"
            aria-label={messages["post.commentContent"]}
          />
          {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
          {state === "sent" ? (
            <p className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle size={15} weight="fill" /> {messages["post.commentSent"]}
            </p>
          ) : null}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] text-faint">{content.length} / 1200</span>
            <button type="submit" disabled={state === "sending"} className="btn btn-primary disabled:opacity-60">
              <PaperPlaneTilt size={15} />
              {state === "sending" ? messages["post.commentSending"] : messages["post.commentSubmit"]}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-8 rounded-xl border border-line p-5 text-sm text-faint">{messages["post.commentClosed"]}</p>
      )}
    </section>
  );
}