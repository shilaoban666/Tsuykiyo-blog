import Link from "next/link";
import { ArrowUpRight, Clock, Eye } from "@phosphor-icons/react/dist/ssr";
import { formatShortDate } from "@/lib/utils";
import { localizeCategory, localizePost, localizeTag } from "@/i18n/content";
import type { Messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import type { PostListItem } from "@/lib/posts";

function Cover({ post }: { post: PostListItem }) {
  if (post.coverUrl) {
    return <img src={post.coverUrl} alt={`${post.title} cover`} className="h-full w-full object-cover" loading="lazy" decoding="async" />;
  }
  return (
    <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(circle_at_70%_20%,rgba(255,122,146,.28),transparent_45%),linear-gradient(150deg,#111526,#07080f)]">
      <div className="absolute right-8 top-8 size-24 rounded-full border border-white/15 bg-white/5" />
      <div className="absolute -bottom-6 left-6 font-display text-8xl text-white/5">月</div>
    </div>
  );
}

export function PostCard({
  post,
  locale,
  messages,
  variant = "default",
}: {
  post: PostListItem;
  locale: Locale;
  messages: Messages;
  variant?: "default" | "featured" | "row";
}) {
  const copy = localizePost(post.slug, locale, { title: post.title, excerpt: post.excerpt });
  const category = post.categorySlug
    ? localizeCategory(post.categorySlug, locale, { name: post.categoryName ?? "", description: "" })
    : null;
  const tags = post.tags.map((tag) => ({ ...tag, label: localizeTag(tag.slug, locale, tag.name) }));
  const date = formatShortDate(post.publishedAt, locale);

  if (variant === "featured") {
    return (
      <article className="group relative grid overflow-hidden rounded-[24px] border border-line bg-surface/40 card-hover md:grid-cols-[1.15fr_1fr]">
        <Link href={`/posts/${post.slug}`} className="image-cover relative aspect-[16/10] overflow-hidden md:aspect-auto md:h-full md:min-h-[300px]">
          <Cover post={post} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[10px] tracking-[0.18em] text-white/85 backdrop-blur">
            FEATURED
          </span>
        </Link>
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex items-center gap-3 text-[11px] tracking-wide text-faint">
              {category ? (
                <Link href={`/categories/${post.categorySlug}`} className="text-accent hover:underline">
                  {category.name}
                </Link>
              ) : null}
              <span className="size-0.5 rounded-full bg-faint" />
              <time>{date}</time>
            </div>
            <Link href={`/posts/${post.slug}`}>
              <h3 className="mt-4 font-serif-cn text-2xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent sm:text-3xl">
                {copy.title}
              </h3>
            </Link>
            <p className="mt-4 line-clamp-3 text-sm leading-7 text-muted">{copy.excerpt}</p>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-line pt-4 text-[11px] text-faint">
            <span className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readingMinutes} {messages["common.minutes"]}</span>
              <span className="inline-flex items-center gap-1.5"><Eye size={13} /> {post.views}</span>
            </span>
            <Link href={`/posts/${post.slug}`} className="inline-flex items-center gap-1 text-muted transition-colors hover:text-accent">
              {messages["common.readMore"]} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "row") {
    return (
      <article className="group flex items-start gap-5 border-b border-line py-5">
        <time className="mt-1 w-16 shrink-0 font-display text-sm text-faint">{date.slice(5)}</time>
        <div className="min-w-0 flex-1">
          <Link href={`/posts/${post.slug}`} className="font-serif-cn text-lg text-ink transition-colors group-hover:text-accent">
            {copy.title}
          </Link>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-faint">
            <span>{category?.name ?? "—"}</span>
            <span>·</span>
            <span>{post.readingMinutes} {messages["common.minutes"]}</span>
          </div>
        </div>
        <ArrowUpRight size={15} className="mt-2 shrink-0 text-faint opacity-0 transition-all duration-300 group-hover:text-accent group-hover:opacity-100" />
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/30 card-hover">
      <Link href={`/posts/${post.slug}`} className="image-cover relative aspect-[3/2] overflow-hidden">
        <Cover post={post} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80" />
        {category ? (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[10px] tracking-wide text-white/85 backdrop-blur">
            {category.name}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.12em] text-faint">
          <time>{date}</time>
          <span>·</span>
          <span>{post.readingMinutes} {messages["common.minutes"]}</span>
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h3 className="mt-3 font-serif-cn text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
            {copy.title}
          </h3>
        </Link>
        <p className="mt-2.5 line-clamp-2 text-[13px] leading-6 text-muted">{copy.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-5">
          {tags.slice(0, 2).map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`} className="text-[10px] tracking-wide text-faint transition-colors hover:text-accent">
              #{tag.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}