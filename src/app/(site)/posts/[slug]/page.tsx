import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarBlank, Clock, Eye } from "@phosphor-icons/react/dist/ssr";
import { MarkdownContent } from "@/components/markdown-content";
import { TableOfContents } from "@/components/table-of-contents";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { Comments } from "@/components/comments";
import { ViewTracker } from "@/components/view-tracker";
import { PostCard } from "@/components/post-card";
import { getAdjacentPosts, getApprovedComments, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import { getI18n } from "@/i18n/server";
import { displayAuthor, localizeCategory, localizePost, localizeTag } from "@/i18n/content";
import { extractHeadings } from "@/lib/markdown-utils";
import { absoluteUrl, decodeParam, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ slug }, { locale }] = await Promise.all([params, getI18n()]);
  const post = await getPostBySlug(decodeParam(slug));
  if (!post) notFound();
  const copy = localizePost(post.slug, locale, { title: post.title, excerpt: post.excerpt });
  return {
    title: locale === "zh" ? post.seoTitle || post.title : copy.title,
    description: locale === "zh" ? post.seoDescription || post.excerpt : copy.excerpt,
    openGraph: {
      type: "article",
      title: copy.title,
      description: copy.excerpt,
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverUrl ? [post.coverUrl] : ["/og.png"],
    },
    alternates: post.sourceUrl ? { canonical: post.sourceUrl } : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const [{ slug }, { locale, messages }] = await Promise.all([params, getI18n()]);
  const post = await getPostBySlug(decodeParam(slug));
  if (!post) notFound();

  const [settings, comments, related, adjacent] = await Promise.all([
    getSettings(),
    getApprovedComments(post.id),
    getRelatedPosts(post.id, post.categoryId, 3),
    post.publishedAt ? getAdjacentPosts(post.publishedAt) : Promise.resolve({ older: null, newer: null }),
  ]);

  const copy = localizePost(post.slug, locale, { title: post.title, excerpt: post.excerpt });
  const category = post.categorySlug
    ? localizeCategory(post.categorySlug, locale, { name: post.categoryName ?? "", description: "" })
    : null;
  const authorName = displayAuthor(locale, settings.authorName);
  const tags = post.tags.map((tag) => ({ ...tag, label: localizeTag(tag.slug, locale, tag.name) }));
  const headings = extractHeadings(post.content);
  const sourceCommentsUrl = post.sourceUrl ? `${post.sourceUrl}#comments` : null;
  const isWechat = post.sourcePlatform === "wechat";
  const sourceLabel = isWechat ? messages["post.sourceWechat"] : "CSDN";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: copy.title,
    description: copy.excerpt,
    image: post.coverUrl ? absoluteUrl(post.coverUrl) : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: authorName },
    publisher: { "@type": "Organization", name: settings.siteName },
    mainEntityOfPage: absoluteUrl(`/posts/${post.slug}`),
    sameAs: post.sourceUrl ?? undefined,
  };

  return (
    <article className="pb-10 pt-28 sm:pt-36">
      <ViewTracker slug={post.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mx-auto max-w-[900px] px-5 sm:px-6">
        <div className="flex items-center gap-2 text-[11px] tracking-wide text-faint">
          <Link href="/posts" className="inline-flex items-center gap-1 transition-colors hover:text-accent">
            <ArrowLeft size={12} /> {messages["post.back"]}
          </Link>
          <span>/</span>
          {category ? (
            <Link href={`/categories/${post.categorySlug}`} className="text-accent transition-opacity hover:opacity-75">
              {category.name}
            </Link>
          ) : (
            <span>—</span>
          )}
        </div>

        <h1 className="mt-7 font-serif-cn text-4xl font-semibold leading-[1.28] tracking-tight text-ink sm:text-5xl">
          {copy.title}
        </h1>
        {locale === "zh" && post.subtitle ? (
          <p className="mt-4 font-serif-cn text-lg leading-8 text-muted">{post.subtitle}</p>
        ) : locale !== "zh" ? (
          <p className="mt-4 font-serif-cn text-lg leading-8 text-muted">{copy.excerpt}</p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-line py-4">
          <div className="flex items-center gap-4">
            <img src={settings.avatarUrl} alt={authorName} className="size-10 rounded-full border border-line object-cover" />
            <div>
              <p className="text-sm font-medium text-ink">{authorName}</p>
              <p className="mt-0.5 flex items-center gap-3 text-[10px] tracking-wide text-faint">
                <span className="inline-flex items-center gap-1"><CalendarBlank size={11} /> {formatDate(post.publishedAt, locale)}</span>
                <span className="inline-flex items-center gap-1"><Clock size={11} /> {post.readingMinutes} {messages["common.minutes"]}</span>
                <span className="inline-flex items-center gap-1"><Eye size={11} /> {post.views}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LikeButton slug={post.slug} initialLikes={post.likes} labels={{ like: messages["common.like"], liked: messages["common.liked"] }} />
            <ShareButton title={copy.title} labels={{ share: messages["common.share"], copied: messages["common.copied"] }} />
          </div>
        </div>

        {post.sourceUrl ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-line bg-surface/25 px-4 py-3 text-[11px] text-faint">
            <span className="inline-flex items-center gap-1.5 font-display tracking-[0.12em] text-muted">
              <span className={`size-1.5 rounded-full ${isWechat ? "bg-emerald-400" : "bg-[#fc5531]"}`} />
              {sourceLabel}
            </span>
            {isWechat ? (
              post.sourceViews || post.sourceLikes || post.sourceComments ? (
                <>
                  {post.sourceViews ? <span>{post.sourceViews.toLocaleString()} {messages["post.wechatViews"]}</span> : null}
                  {post.sourceLikes ? <span>{post.sourceLikes.toLocaleString()} {messages["post.wechatLikes"]}</span> : null}
                  {post.sourceComments ? <span>{post.sourceComments.toLocaleString()} {messages["post.wechatComments"]}</span> : null}
                </>
              ) : null
            ) : (
              <>
                <span>{post.sourceViews.toLocaleString()} {messages["post.sourceViews"]}</span>
                <span>{post.sourceComments} {messages["post.sourceComments"]}</span>
              </>
            )}
            <a href={isWechat ? post.sourceUrl : sourceCommentsUrl ?? post.sourceUrl} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 text-accent transition-opacity hover:opacity-75">
              {messages["post.readOriginal"]} <ArrowUpRight size={12} />
            </a>
          </div>
        ) : null}
      </header>

      {post.coverUrl ? (
        <figure className="mx-auto mt-10 max-w-[1120px] px-5 sm:px-6">
          <div className="post-cover-hero overflow-hidden rounded-[22px] border border-line image-cover">
            <img src={post.coverUrl} alt={`${copy.title} cover`} className="aspect-[3/2] w-full object-cover" fetchPriority="high" decoding="async" />
          </div>
          <figcaption className="mt-3 flex items-center justify-between text-[10px] tracking-[0.12em] text-faint">
            <span>{category?.name ?? "TSUKIYO"} · VISUAL NOTE</span>
            <span>{post.publishedAt?.slice(0, 10)}</span>
          </figcaption>
        </figure>
      ) : null}

      <div className="mx-auto mt-12 grid max-w-[1120px] gap-12 px-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_210px] lg:gap-16">
        <div className="min-w-0">
          {locale !== "zh" ? (
            <p className="mb-8 rounded-xl border border-line bg-surface/30 px-4 py-3 text-xs leading-6 text-faint">
              {messages["post.originalNotice"]}
            </p>
          ) : null}
          <MarkdownContent content={post.content} />

          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="mr-1 text-[10px] tracking-[0.16em] text-faint">{messages["post.tagged"]}</span>
            {tags.length ? (
              tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${tag.slug}`} className="chip">
                  #{tag.label}
                </Link>
              ))
            ) : (
              <span className="text-xs text-faint">{messages["post.noTags"]}</span>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/25 px-5 py-4">
            <p className="font-serif-cn text-sm text-muted">{messages["post.likeHint"]}</p>
            <LikeButton slug={post.slug} initialLikes={post.likes} labels={{ like: messages["common.like"], liked: messages["common.liked"] }} />
          </div>

          {post.sourceUrl && !isWechat && post.sourceComments > 0 ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface/20 px-5 py-4">
              <p className="text-xs text-muted">
                <span className="font-display tracking-[0.12em] text-ink">CSDN</span> · {post.sourceComments} {messages["post.sourceComments"]}
              </p>
              <a href={sourceCommentsUrl ?? post.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent transition-opacity hover:opacity-75">
                {messages["post.readOriginal"]} <ArrowUpRight size={13} />
              </a>
            </div>
          ) : null}

          <Comments postSlug={post.slug} comments={comments} enabled={settings.commentsEnabled} locale={locale} messages={messages} />
        </div>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} labels={{ toc: messages["post.toc"], note: messages["post.tocNote"] }} />
        </aside>
      </div>

      <div className="mx-auto mt-16 max-w-[1120px] px-5 sm:px-6">
        <div className="grid gap-4 border-y border-line py-8 sm:grid-cols-2">
          {adjacent.older ? (
            <Link href={`/posts/${adjacent.older.slug}`} className="group">
              <span className="text-[10px] tracking-[0.18em] text-faint">← {messages["post.prev"]}</span>
              <p className="mt-2 font-serif-cn text-lg text-muted transition-colors group-hover:text-accent">
                {localizePost(adjacent.older.slug, locale, { title: adjacent.older.title, excerpt: "" }).title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {adjacent.newer ? (
            <Link href={`/posts/${adjacent.newer.slug}`} className="group sm:text-right">
              <span className="text-[10px] tracking-[0.18em] text-faint">{messages["post.next"]} →</span>
              <p className="mt-2 font-serif-cn text-lg text-muted transition-colors group-hover:text-accent">
                {localizePost(adjacent.newer.slug, locale, { title: adjacent.newer.title, excerpt: "" }).title}
              </p>
            </Link>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="mx-auto mt-20 max-w-[1240px] px-5 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-serif-cn text-2xl font-semibold text-ink">{messages["post.related"]}</h2>
            <Link href="/posts" className="inline-flex items-center gap-1 text-xs text-faint transition-colors hover:text-accent">
              {messages["home.latestLink"]} <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.id} post={item} locale={locale} messages={messages} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}