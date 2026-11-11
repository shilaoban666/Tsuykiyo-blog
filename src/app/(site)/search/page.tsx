import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PostGrid } from "@/components/post-grid";
import { EmptyState } from "@/components/empty-state";
import { listPosts } from "@/lib/posts";
import { getI18n } from "@/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["common.search"] };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const [{ locale, messages }, { q }] = await Promise.all([getI18n(), searchParams]);
  const query = q?.trim() ?? "";
  const posts = query ? await listPosts({ search: query, limit: 24 }) : [];

  return (
    <>
      <PageHeader
        eyebrow="Find a sentence"
        title={messages["search.title"]}
        description={messages["search.desc"]}
      >
        <form action="/search" method="get" className="mt-9 flex max-w-2xl items-center gap-2 rounded-2xl border border-line bg-surface/40 p-2 pl-4">
          <MagnifyingGlass size={19} className="shrink-0 text-faint" />
          <input
            name="q"
            defaultValue={query}
            autoFocus
            placeholder={messages["search.placeholder"]}
            className="min-w-0 flex-1 bg-transparent py-2.5 text-base text-ink outline-none placeholder:text-faint"
            aria-label={messages["common.search"]}
          />
          <button type="submit" className="btn btn-primary">
            {messages["search.button"]}
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-faint">
          <span>—</span>
          {["Java", "Spring", "MySQL", "Python"].map((word) => (
            <a key={word} href={`/search?q=${encodeURIComponent(word)}`} className="transition-colors hover:text-accent">
              {word}
            </a>
          ))}
        </div>
      </PageHeader>

      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-6">
        {query ? (
          <>
            <p className="mb-8 text-sm text-faint">
              {messages["search.resultFor"]}「<span className="text-accent">{query}</span>」— {posts.length}
            </p>
            {posts.length ? (
              <PostGrid posts={posts} locale={locale} messages={messages} />
            ) : (
              <EmptyState
                title={messages["search.emptyTitle"]}
                description={messages["search.emptyDesc"]}
                action={{ label: messages["search.emptyAction"], href: "/archive" }}
              />
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-line px-6 py-20 text-center">
            <p className="font-display text-5xl text-ink/10">?</p>
            <p className="mt-4 font-serif-cn text-lg text-muted">{messages["search.idleTitle"]}</p>
            <p className="mt-2 text-xs text-faint">{messages["search.idleDesc"]}</p>
          </div>
        )}
      </div>
    </>
  );
}