import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/page-header";
import { getArchive, getSiteStats } from "@/lib/posts";
import { getI18n } from "@/i18n/server";
import { localizeCategory, localizePost } from "@/i18n/content";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["nav.archive"] };
}

export default async function ArchivePage() {
  const [{ locale, messages }, archive, stats] = await Promise.all([getI18n(), getArchive(), getSiteStats()]);
  const total = archive.reduce((sum, group) => sum + group.posts.length, 0);

  return (
    <>
      <PageHeader
        eyebrow="Every moon has a date"
        title={
          <>
            {messages["archive.title1"]}
            <br />
            {messages["archive.title2"]}
          </>
        }
        description={messages["archive.desc"]}
        meta={
          <div className="flex flex-wrap gap-3">
            <span className="chip">{total} {messages["common.articles"]}</span>
            <span className="chip">{archive.length} {messages["archive.years"]}</span>
            <span className="chip">{stats.views} {messages["common.views"]}</span>
          </div>
        }
      />

      <div className="mx-auto max-w-[1000px] px-5 py-12 sm:px-6">
        {archive.map((group, groupIndex) => (
          <section key={group.year} className="grid gap-6 border-b border-line py-12 first:pt-2 sm:grid-cols-[140px_1fr]">
            <div className="sm:sticky sm:top-28 sm:self-start">
              <p className="font-display text-5xl text-ink/80">{group.year}</p>
              <p className="mt-2 text-[10px] tracking-[0.18em] text-faint">{String(group.posts.length).padStart(2, "0")} {messages["common.articles"]}</p>
              <div className="mt-4 h-px w-12 bg-accent" />
            </div>
            <div>
              {group.posts.map((post) => {
                const copy = localizePost(post.slug, locale, { title: post.title, excerpt: "" });
                const category = post.categorySlug
                  ? localizeCategory(post.categorySlug, locale, { name: post.category ?? "", description: "" })
                  : null;
                return (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="group flex items-baseline gap-4 border-b border-line/60 py-4 last:border-0"
                  >
                    <span className="w-12 shrink-0 font-display text-xs text-faint">{post.date.slice(5).replace("-", ".")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif-cn text-lg text-ink transition-colors group-hover:text-accent">{copy.title}</span>
                      <span className="mt-1 block text-[10px] tracking-wide text-faint">
                        {category?.name ?? "—"} · {post.minutes} {messages["common.minutes"]}
                      </span>
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-faint opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
            {groupIndex === archive.length - 1 ? (
              <div className="sm:col-span-2 sm:pl-[164px]">
                <p className="font-display text-xs tracking-[0.24em] text-faint">— {messages["archive.continued"]} —</p>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </>
  );
}