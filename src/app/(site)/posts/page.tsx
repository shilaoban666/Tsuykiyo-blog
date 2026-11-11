import Link from "next/link";
import type { Metadata } from "next";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { Pagination } from "@/components/pagination";
import { EmptyState } from "@/components/empty-state";
import { getCategoriesWithCounts, countPosts, listPosts } from "@/lib/posts";
import { getI18n } from "@/i18n/server";
import { localizeCategory } from "@/i18n/content";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["nav.posts"] };
}

const PAGE_SIZE = 9;

type SearchParams = Promise<{ page?: string; q?: string; category?: string }>;

export default async function PostsPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ locale, messages }, params] = await Promise.all([getI18n(), searchParams]);
  const page = Math.max(1, Number(params.page) || 1);
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";

  const [posts, total, categories] = await Promise.all([
    listPosts({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, search: q || undefined, categorySlug: category || undefined }),
    countPosts({ search: q || undefined, categorySlug: category || undefined }),
    getCategoriesWithCounts(),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const averageMinutes = posts.length
    ? Math.max(1, Math.round(posts.reduce((sum, post) => sum + post.readingMinutes, 0) / posts.length))
    : 0;
  const localizedCategories = categories.map((item) => ({
    ...item,
    ...localizeCategory(item.slug, locale, { name: item.name, description: item.description }),
  }));

  return (
    <>
      <PageHeader
        eyebrow="The writing archive"
        title={
          <>
            {messages["posts.title1"]}
            <br />
            {messages["posts.title2"]}
          </>
        }
        description={messages["posts.desc"]}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip">{String(total).padStart(2, "0")} {messages["common.articles"]}</span>
            <span className="chip">{String(categories.length).padStart(2, "0")} {messages["home.statCategories"]}</span>
            <span className="chip">{averageMinutes} {messages["common.minutes"]}</span>
          </div>
        }
      >
        <form action="/posts" method="get" className="mt-9 flex max-w-xl items-center gap-2 rounded-full border border-line bg-surface/40 p-1.5 pl-4">
          <MagnifyingGlass size={17} className="shrink-0 text-faint" />
          <input
            name="q"
            defaultValue={q}
            placeholder={messages["posts.searchPlaceholder"]}
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-faint"
            aria-label={messages["common.search"]}
          />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <button type="submit" className="btn btn-primary !px-4 !py-2.5 text-xs">
            {messages["posts.searchButton"]}
          </button>
        </form>
      </PageHeader>

      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-line pb-6">
          <Link href={q ? `/posts?q=${encodeURIComponent(q)}` : "/posts"} className={`chip ${!category ? "!border-accent !text-accent" : ""}`}>
            {messages["common.all"]}
          </Link>
          {localizedCategories.map((item) => (
            <Link
              key={item.id}
              href={`/posts?category=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`chip ${category === item.slug ? "!border-accent !text-accent" : ""}`}
            >
              {item.name} <span className="opacity-50">{item.count}</span>
            </Link>
          ))}
          {(q || category) && (
            <Link href="/posts" className="ml-auto text-[11px] text-faint transition-colors hover:text-accent">
              {messages["posts.clearFilters"]}
            </Link>
          )}
        </div>

        {q ? (
          <p className="mt-6 text-xs text-faint">
            {messages["posts.resultFor"]}「<span className="text-accent">{q}</span>」— {total}
          </p>
        ) : null}

        <div className="mt-8">
          {posts.length ? (
            <PostGrid posts={posts} locale={locale} messages={messages} />
          ) : (
            <EmptyState
              title={messages["posts.emptyTitle"]}
              description={messages["posts.emptyDesc"]}
              action={{ label: messages["posts.emptyAction"], href: "/posts" }}
            />
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/posts"
          searchParams={{ q: q || undefined, category: category || undefined }}
          previousLabel={messages["common.previous"]}
          nextLabel={messages["common.next"]}
        />
      </div>
    </>
  );
}