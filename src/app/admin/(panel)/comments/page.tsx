import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CommentsModeration } from "@/components/admin/comments-moderation";
import { listAdminComments } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "all" } = await searchParams;
  const comments = await listAdminComments(status);

  return (
    <div>
      <AdminPageHeader
        eyebrow="CONVERSATION / MODERATION"
        title="评论"
        description="所有留言都会先进入待审核。你决定哪些话可以被看见。"
      />
      <div className="mt-6 flex flex-wrap items-center gap-1 rounded-full border border-line p-1 w-fit">
        {[
          { key: "all", label: "全部" },
          { key: "pending", label: "待审核" },
          { key: "approved", label: "已通过" },
          { key: "spam", label: "垃圾" },
        ].map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/comments" : `/admin/comments?status=${tab.key}`}
            className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${status === tab.key ? "bg-accent text-[var(--accent-ink)]" : "text-muted hover:text-ink"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="mt-5">
        <CommentsModeration comments={comments} />
      </div>
    </div>
  );
}