import Link from "next/link";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getCategoriesWithCounts, getTagsWithCounts } from "@/lib/posts";
import { getI18n } from "@/i18n/server";
import { localizeCategory, localizeTag } from "@/i18n/content";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["nav.tags"] };
}

export default async function TagsPage() {
  const [{ locale, messages }, tags, categories] = await Promise.all([
    getI18n(),
    getTagsWithCounts(),
    getCategoriesWithCounts(),
  ]);
  const max = Math.max(...tags.map((tag) => tag.count), 1);
  const localizedTags = tags.map((tag) => ({ ...tag, label: localizeTag(tag.slug, locale, tag.name) }));
  const localizedCategories = categories.map((category) => ({
    ...category,
    ...localizeCategory(category.slug, locale, { name: category.name, description: category.description }),
  }));

  return (
    <>
      <PageHeader
        eyebrow="A map of recurring things"
        title={messages["tags.title"]}
        description={messages["tags.desc"]}
        meta={<span className="chip">{tags.length} {messages["tags.count"]}</span>}
      />

      <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-4">
          {localizedTags.map((tag) => {
            const weight = 0.72 + (tag.count / max) * 0.7;
            return (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="group inline-flex items-baseline gap-1.5 font-serif-cn text-muted transition-colors hover:text-accent"
                style={{ fontSize: `${weight}rem` }}
              >
                <span className="text-[0.55em] text-faint">#</span>
                {tag.label}
                <sup className="font-sans text-[9px] tracking-wide text-faint">{tag.count}</sup>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 border-t border-line pt-12">
          <p className="eyebrow">{messages["tags.rooms"]}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {localizedCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group flex items-center justify-between rounded-2xl border border-line bg-surface/30 p-5 transition-all duration-300 hover:border-[var(--line-strong)]"
              >
                <div>
                  <p className="font-serif-cn text-lg text-ink transition-colors group-hover:text-accent">{category.name}</p>
                  <p className="mt-1 text-[11px] text-faint">{category.description}</p>
                </div>
                <span className="font-display text-2xl text-faint">{String(category.count).padStart(2, "0")}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}