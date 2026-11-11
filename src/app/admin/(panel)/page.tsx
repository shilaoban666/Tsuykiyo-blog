import Link from "next/link";
import {
  ArrowUpRight,
  Article,
  ChatCircleDots,
  Eye,
  Images,
  PenNib,
  Plus,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader, StatusBadge } from "@/components/admin/admin-page-header";
import { getDashboardData } from "@/lib/admin";
import { getSessionUser } from "@/lib/auth";
import { formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return formatShortDate(iso);
}

export default async function AdminDashboardPage() {
  const [data, user] = await Promise.all([getDashboardData(), getSessionUser()]);
  const maxMonthly = Math.max(...data.monthly.map((item) => item.count), 1);
  const hour = new Date().getHours();
  const greeting = hour < 6 ? "夜还很深" : hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好";

  const cards = [
    { label: "已发布文章", value: data.counts.published, sub: `${data.counts.drafts} 篇草稿`, icon: Article, accent: "text-accent" },
    { label: "累计阅读", value: data.counts.views, sub: "所有文章", icon: Eye, accent: "text-cyan" },
    { label: "评论", value: data.counts.comments, sub: `${data.counts.pendingComments} 条待审核`, icon: ChatCircleDots, accent: "text-gold" },
    { label: "媒体文件", value: data.counts.media, sub: "图片与封面", icon: Images, accent: "text-violet" },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="OVERVIEW / TODAY"
        title={`${greeting}，${user?.name ?? "月白主人"}`}
        description="这是你的写作空间。所有数字都来自本地 PostgreSQL，没有第三方统计。"
        action={
          <Link href="/admin/posts/new" className="btn btn-primary">
            <Plus size={15} weight="bold" /> 写新的文章
          </Link>
        }
      />

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="group relative overflow-hidden rounded-2xl border border-line bg-surface/30 p-5 transition-colors hover:border-[var(--line-strong)]">
              <div className="flex items-start justify-between">
                <p className="text-[11px] tracking-[0.08em] text-faint">{card.label}</p>
                <Icon size={18} weight="light" className={card.accent} />
              </div>
              <p className="mt-5 font-display text-4xl leading-none text-ink">{card.value}</p>
              <p className="mt-2 text-[10px] text-faint">{card.sub}</p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-line bg-surface/25 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-[10px] tracking-[0.24em] text-faint">PUBLISHING RHYTHM</p>
              <h2 className="mt-2 font-serif-cn text-xl text-ink">最近八个月的发布节奏</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[10px] text-muted">
              <TrendUp size={12} /> {data.counts.published} 篇
            </span>
          </div>
          <div className="mt-8 flex h-48 items-end gap-3">
            {data.monthly.length ? (
              data.monthly.map((item) => (
                <div key={item.month} className="group flex flex-1 flex-col items-center gap-2">
                  <span className="font-display text-xs text-faint opacity-0 transition-opacity group-hover:opacity-100">{item.count}</span>
                  <div className="relative flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-accent/35 to-accent/80 transition-all duration-500 group-hover:from-accent/50 group-hover:to-accent"
                      style={{ height: `${Math.max(8, (item.count / maxMonthly) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] tracking-wide text-faint">{item.month.slice(5)}月</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-faint">还没有发布记录。</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface/25 p-6">
          <p className="font-display text-[10px] tracking-[0.24em] text-faint">QUICK ACTIONS</p>
          <div className="mt-4 space-y-2">
            {[
              { href: "/admin/posts/new", label: "写一篇文章", hint: "Markdown 编辑器", icon: PenNib },
              { href: "/admin/comments", label: "审核评论", hint: `${data.counts.pendingComments} 条待处理`, icon: ChatCircleDots },
              { href: "/admin/media", label: "上传图片", hint: "封面与插图", icon: Images },
              { href: "/admin/settings", label: "调整站点", hint: "站点信息与关于页", icon: Article },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-line hover:bg-ink/[0.03]">
                  <span className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                    <Icon size={17} weight="light" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm text-ink">{item.label}</span>
                    <span className="block text-[10px] text-faint">{item.hint}</span>
                  </span>
                  <ArrowUpRight size={14} className="text-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface/25">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-serif-cn text-lg text-ink">最近编辑</h2>
            <Link href="/admin/posts" className="text-[11px] text-faint transition-colors hover:text-accent">全部文章</Link>
          </div>
          <div className="divide-y divide-line">
            {data.recentPosts.map((post) => (
              <Link key={post.id} href={`/admin/posts/${post.id}`} className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-ink/[0.02]">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-ink transition-colors group-hover:text-accent">{post.title}</p>
                  <p className="mt-1 text-[10px] text-faint">{post.categoryName ?? "未分类"} · {timeAgo(post.updatedAt)}</p>
                </div>
                <StatusBadge status={post.status} />
              </Link>
            ))}
            {!data.recentPosts.length ? <p className="px-6 py-10 text-sm text-faint">还没有文章。</p> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface/25">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-serif-cn text-lg text-ink">最近的留言</h2>
            <Link href="/admin/comments" className="text-[11px] text-faint transition-colors hover:text-accent">审核评论</Link>
          </div>
          <div className="divide-y divide-line">
            {data.recentComments.map((comment) => (
              <div key={comment.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-ink">
                    {comment.authorName} <span className="text-faint">在《{comment.postTitle}》</span>
                  </p>
                  <StatusBadge status={comment.status} />
                </div>
                <p className="mt-1.5 line-clamp-1 text-[11px] text-faint">{comment.content}</p>
              </div>
            ))}
            {!data.recentComments.length ? <p className="px-6 py-10 text-sm text-faint">还没有评论。</p> : null}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-surface/25 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-cn text-lg text-ink">阅读最多的文章</h2>
          <span className="font-display text-[10px] tracking-[0.2em] text-faint">TOP 5</span>
        </div>
        <div className="mt-4 space-y-2">
          {data.topPosts.map((post, index) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} target="_blank" className="group flex items-center gap-4 rounded-lg px-2 py-2 transition-colors hover:bg-ink/[0.03]">
              <span className="w-6 font-display text-sm text-faint">{String(index + 1).padStart(2, "0")}</span>
              <span className="flex-1 truncate text-sm text-muted transition-colors group-hover:text-ink">{post.title}</span>
              <span className="text-[11px] text-faint">{post.views} 阅读</span>
            </Link>
          ))}
          {!data.topPosts.length ? <p className="text-sm text-faint">还没有发布文章。</p> : null}
        </div>
      </section>
    </div>
  );
}