import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { countPosts, getTagsWithCounts, listPosts } from "@/lib/posts";
import { getI18n } from "@/i18n/server";
import { localizeTag } from "@/i18n/content";
import { decodeParam } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { locale } = await getI18n();
  const tags = await getTagsWithCounts();
  const tag = tags.find((item) => item.slug === decodeParam(slug));
  if (!tag) notFound();
  return { title: `#${localizeTag(tag.slug, locale, tag.name)}` };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ locale, messages }, { slug }, { page: pageParam }] = await Promise.all([getI18n(), params, searchParams]);
  const tags = await getTagsWithCounts();
  const tag = tags.find((item) => item.slug === decodeParam(slug));
  if (!tag) notFound();
  const label = localizeTag(tag.slug, locale, tag.name);

  const page = Math.max(1, Number(pageParam) || 1);
  const [posts, total] = await Promise.all([
    listPosts({ tagSlug: tag.slug, limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    countPosts({ tagSlug: tag.slug }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Collected fragments"
        title={<><span className="text-faint">#</span>{label}</>}
        description={`${messages["tags.desc"].split(".")[0]}.`}
        meta={<span className="chip">{String(total).padStart(2, "0")} {messages["common.articles"]}</span>}
      />
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-6">
        {posts.length ? (
          <PostGrid posts={posts} locale={locale} messages={messages} />
        ) : (
          <EmptyState
            title={messages["tags.empty"]}
            description={messages["tags.emptyDesc"]}
            action={{ label: messages["tags.back"], href: "/tags" }}
          />
        )}
        <Pagination
          page={page}
          totalPages={Math.ceil(total / PAGE_SIZE)}
          basePath={`/tags/${tag.slug}`}
          previousLabel={messages["common.previous"]}
          nextLabel={messages["common.next"]}
        />
      </div>
    </>
  );
}