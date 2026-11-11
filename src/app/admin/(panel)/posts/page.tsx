import Link from "next/link";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react/dist/ssr";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostsTable } from "@/components/admin/posts-table";
import { listAdminPosts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const q = params.q?.trim() ?? "";
  const posts = await listAdminPosts({ status, q });

  const tabs = [
    { key: "all", label: "全部" },
    { key: "published", label: "已发布" },
    { key: "draft", label: "草稿" },
  ];

  return (
    <div>
      <AdminPageHeader
        eyebrow="CONTENT / POSTS"
        title="文章"
        description="写作、修改与发布。每一篇都可以随时退回草稿。"
        action={<Link href="/admin/posts/new" className="btn btn-primary"><Plus size={15} weight="bold" /> 新文章</Link>}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line p-1">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/admin/posts${tab.key === "all" ? "" : `?status=${tab.key}`}${q ? `${tab.key === "all" ? "?" : "&"}q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${status === tab.key ? "bg-accent text-[var(--accent-ink)]" : "text-muted hover:text-ink"}`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form action="/admin/posts" method="get" className="flex items-center gap-2 rounded-full border border-line bg-surface/30 px-3 py-1.5">
          {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
          <MagnifyingGlass size={14} className="text-faint" />
          <input name="q" defaultValue={q} placeholder="搜索标题或 slug" className="w-40 bg-transparent text-xs text-ink outline-none placeholder:text-faint sm:w-56" aria-label="搜索文章" />
          <button type="submit" className="text-[10px] text-accent">搜索</button>
        </form>
      </div>

      <div className="mt-5">
        <PostsTable posts={posts} />
      </div>
      <p className="mt-4 text-[10px] text-faint">共 {posts.length} 篇 · 按最后编辑时间排序</p>
    </div>
  );
}