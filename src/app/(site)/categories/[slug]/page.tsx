import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { countPosts, getCategoriesWithCounts, listPosts } from "@/lib/posts";
import { getI18n } from "@/i18n/server";
import { localizeCategory } from "@/i18n/content";
import { decodeParam } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const categories = await getCategoriesWithCounts();
  const category = categories.find((item) => item.slug === decodeParam(slug));
  if (!category) notFound();
  const copy = localizeCategory(category.slug, locale, category);
  return { title: `${copy.name} · ${locale === "zh" ? "分类" : "Category"}` };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale, messages }, { slug }, { page: pageParam }] = await Promise.all([getI18n(), params, searchParams]);
  const categories = await getCategoriesWithCounts();
  const category = categories.find((item) => item.slug === decodeParam(slug));
  if (!category) notFound();
  const copy = localizeCategory(category.slug, locale, category);

  const page = Math.max(1, Number(pageParam) || 1);
  const [posts, total] = await Promise.all([
    listPosts({ categorySlug: category.slug, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    countPosts({ categorySlug: category.slug }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Room of thoughts"
        title={copy.name}
        description={copy.description || messages["posts.desc"]}
        meta={
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full" style={{ background: category.accent }} />
            <span className="chip">{String(total).padStart(2, "0")} {messages["common.articles"]}</span>
            <Link href="/posts" className="chip">{messages["home.latestLink"]}</Link>
          </div>
        }
      />
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-6">
        {posts.length ? (
          <PostGrid posts={posts} locale={locale} messages={messages} />
        ) : (
          <EmptyState
            title={messages["posts.emptyTitle"]}
            description={messages["posts.emptyDesc"]}
            action={{ label: messages["posts.emptyAction"], href: "/posts" }}
          />
        )}
        <Pagination
          page={page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          basePath={`/categories/${category.slug}`}
          previousLabel={messages["common.previous"]}
          nextLabel={messages["common.next"]}
        />
      </div>
    </>
  );
}