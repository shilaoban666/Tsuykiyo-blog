import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Clock, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { PostCard } from "@/components/post-card";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { TaglineReveal } from "@/components/tagline-reveal";
import { HeroParallax } from "@/components/hero-parallax";
import { CountUp } from "@/components/count-up";
import { getCategoriesWithCounts, getSiteStats, listPosts } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import { getI18n } from "@/i18n/server";
import { displayAuthor, localizeCategory } from "@/i18n/content";
import { formatShortDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return {
    title: { absolute: `${messages["home.title1"]} ${messages["home.title2"]} · 月白 TSUKIYO` },
    description: messages["home.subtitle"],
  };
}

const petals = [
  { left: "8%", size: 8, duration: 19, delay: 0 },
  { left: "18%", size: 5, duration: 24, delay: 4 },
  { left: "31%", size: 7, duration: 21, delay: 9 },
  { left: "44%", size: 4, duration: 26, delay: 2 },
  { left: "58%", size: 9, duration: 23, delay: 12 },
  { left: "68%", size: 5, duration: 18, delay: 6 },
  { left: "78%", size: 7, duration: 25, delay: 14 },
  { left: "88%", size: 4, duration: 22, delay: 8 },
];

// 固定种子的伪随机，保证服务端与客户端渲染出同一片星空
const starLayers = [0, 1, 2].map((layer) => {
  const shadows = Array.from({ length: 14 }, (_, index) => {
    const rand = (salt: number) => {
      const x = Math.sin((layer * 14 + index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    const spread = rand(3) > 0.8 ? 0.8 : 0;
    return `${(rand(1) * 100).toFixed(2)}vw ${(rand(2) * 56).toFixed(2)}vh 0 ${spread}px rgba(255,255,255,${(0.6 + rand(4) * 0.4).toFixed(2)})`;
  });
  return { boxShadow: shadows.join(", "), duration: `${3.2 + layer * 1.7}s`, delay: `${layer * 1.1}s` };
});

export default async function HomePage() {
  const [{ locale, messages }, settings, latest, categories, stats] = await Promise.all([
    getI18n(),
    getSettings(),
    listPosts({ limit: 6 }),
    getCategoriesWithCounts(),
    getSiteStats(),
  ]);

  const featured = latest[0];
  const rest = latest.slice(1, 4);
  const archiveRows = latest.slice(0, 5);
  const startYear = settings.startDate.slice(0, 4);
  const heroLines =
    locale === "zh"
      ? settings.heroTitle.split("/").map((line) => line.trim()).filter(Boolean)
      : [messages["home.title1"], messages["home.title2"]];
  const heroSubtitle = locale === "zh" ? settings.heroSubtitle : messages["home.subtitle"];
  const authorName = displayAuthor(locale, settings.authorName);
  const localizedCategories = categories.map((category) => ({
    ...category,
    ...localizeCategory(category.slug, locale, { name: category.name, description: category.description }),
  }));
  const ticker = [
    locale === "zh" ? settings.announcement : messages["home.ticker1"],
    messages["home.ticker2"],
    messages["home.ticker3"],
  ];

  return (
    <>
      {/* ——— HERO ——— */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-28">
        <HeroParallax className="absolute inset-0">
          <img
            src="/art/generated/hero-night.webp"
            alt="雨夜屋顶上撑伞望月的银发少女与城市灯火"
            className="hero-art-image hero-art-night h-full w-full object-cover"
            fetchPriority="high"
          />
          <img
            src="/art/generated/hero-dawn.webp"
            alt="清晨屋顶上撑伞远望城市的银发少女"
            className="hero-art-image hero-art-dawn h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="hero-scrim-night absolute inset-0 bg-gradient-to-r from-[#07080f] via-[#07080f]/72 to-transparent lg:via-[#07080f]/45" />
          <div className="hero-scrim-dawn absolute inset-0 bg-gradient-to-r from-[#f4f0e7] via-[#f4f0e7]/72 to-transparent lg:via-[#f4f0e7]/38" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--bg)]/80 to-transparent" />
        </HeroParallax>

        <div className="hero-stars pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {starLayers.map((layer, index) => (
            <span
              key={index}
              className="star-layer"
              style={{ boxShadow: layer.boxShadow, animationDuration: layer.duration, animationDelay: layer.delay }}
            />
          ))}
          <span className="meteor" style={{ left: "62%", top: "6%", animationDelay: "2.5s" }} />
          <span className="meteor" style={{ left: "34%", top: "14%", animationDelay: "9s", animationDuration: "13s" }} />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {petals.map((petal, index) => (
            <span
              key={index}
              className="petal"
              style={{
                left: petal.left,
                width: petal.size,
                height: petal.size * 1.5,
                animationDuration: `${petal.duration}s`,
                animationDelay: `${petal.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-6">
          <div className="max-w-[680px]">
            <div className="animate-fade flex items-center gap-3">
              <span className="accent-dot" />
              <p className="eyebrow text-[var(--text-2)]">{settings.heroEyebrow}</p>
            </div>

            <h1 className="hero-copy mt-8 font-serif-cn text-5xl font-medium leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-8xl">
                {heroLines.map((line, index) => (
                  <span key={`${line}-${index}`} className="hero-line">
                    <span
                      className={index === 0 ? "text-gradient-moon" : "text-ink"}
                      style={{ animationDelay: `${120 + index * 130}ms` }}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h1>

              <p className="hero-copy-soft animate-rise mt-7 max-w-[540px] text-[15px] leading-8 text-[var(--text-2)] [animation-delay:380ms]">
                {heroSubtitle}
              </p>

              <div className="animate-rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:480ms]">
                <Link href="/posts" className="btn btn-primary group">
                  {messages["home.ctaRead"]}
                  <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
                <Link href="/about" className="btn btn-ghost">
                  {messages["home.ctaAbout"]}
                </Link>
                <span className="ml-1 hidden items-center gap-2 text-[11px] tracking-wide text-faint sm:inline-flex">
                  <span className="size-1 rounded-full bg-emerald-400" />
                  {messages["home.latestUpdate"]} {featured ? formatShortDate(featured.publishedAt, locale) : "—"}
                </span>
              </div>

              <div className="animate-fade mt-14 grid grid-cols-2 gap-4 border-t border-line pt-5 [animation-delay:620ms] sm:flex sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
                {[
                  { value: String(stats.posts).padStart(2, "0"), label: messages["home.statPosts"] },
                  { value: String(stats.categories).padStart(2, "0"), label: messages["home.statCategories"] },
                  { value: stats.views > 999 ? `${(stats.views / 1000).toFixed(1)}k` : String(stats.views), label: messages["home.statViews"] },
                  { value: `${new Date().getFullYear() - Number(startYear)}`, label: messages["home.statYears"] },
                ].map((item) => (
                  <div key={item.label} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-ink"><CountUp value={item.value} delay={700} /></span>
                    <span className="text-[11px] tracking-[0.16em] text-faint">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

          <div className="mt-10 flex items-center justify-between border-t border-line pr-28 pt-5 text-[11px] tracking-[0.16em] text-faint sm:pr-56 2xl:pr-0">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent" /> VOL. {new Date().getFullYear()} / {String(new Date().getMonth() + 1).padStart(2, "0")}
            </span>
            <span className="hidden sm:inline">30.2741° N · 120.1551° E</span>
            <span>EST. {startYear}</span>
          </div>
        </div>
      </section>

      {/* ——— notice ticker ——— */}
      <div className="overflow-hidden border-y border-line bg-surface/20">
        <div className="flex whitespace-nowrap py-3 text-[10px] tracking-[0.22em] text-faint">
          <div className="flex min-w-full shrink-0 animate-[marquee_38s_linear_infinite] items-center justify-around gap-12">
            <span className="flex items-center gap-2"><Sparkle size={12} className="text-accent" /> {ticker[0]}</span>
            <span>{ticker[1]}</span>
            <span className="flex items-center gap-2"><span className="accent-dot" /> {ticker[2]}</span>
            <span>{messages["footer.local"]}</span>
          </div>
          <div className="flex min-w-full shrink-0 animate-[marquee_38s_linear_infinite] items-center justify-around gap-12" aria-hidden>
            <span className="flex items-center gap-2"><Sparkle size={12} className="text-accent" /> {ticker[0]}</span>
            <span>{ticker[1]}</span>
            <span className="flex items-center gap-2"><span className="accent-dot" /> {ticker[2]}</span>
            <span>{messages["footer.local"]}</span>
          </div>
        </div>
      </div>

      {/* ——— featured ——— */}
      <section className="mx-auto max-w-[1240px] px-5 pt-20 sm:px-6 sm:pt-28">
        <Reveal>
          <SectionHeading
            index="01"
            title={messages["home.latestTitle"]}
            description={messages["home.latestDesc"]}
            href="/posts"
            linkLabel={messages["home.latestLink"]}
          />
        </Reveal>

        {featured ? (
          <div className="mt-10 grid gap-10">
            <Reveal delay={0.05}>
              <PostCard post={featured} locale={locale} messages={messages} variant="featured" />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {rest.map((post, index) => (
                <Reveal key={post.id} delay={0.08 + index * 0.06} className="h-full">
                  <PostCard post={post} locale={locale} messages={messages} />
                </Reveal>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line p-16 text-center text-sm text-faint">
            {messages["posts.emptyTitle"]}
          </div>
        )}
      </section>

      {/* ——— tagline reveal ——— */}
      <TaglineReveal lines={[messages["home.tagline1"], messages["home.tagline2"]]} />

      {/* ——— categories ——— */}
      <section className="mx-auto max-w-[1240px] px-5 sm:px-6">
        <Reveal>
          <SectionHeading index="02" title={messages["home.categoriesTitle"]} description={messages["home.categoriesDesc"]} href="/tags" linkLabel={messages["home.categoriesLink"]} />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {localizedCategories.map((category, index) => (
            <Reveal key={category.id} delay={index * 0.05}>
              <Link
                href={`/categories/${category.slug}`}
                className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface/30 p-4 transition-all sm:min-h-[210px] sm:p-6 duration-500 hover:-translate-y-1 hover:border-[var(--line-strong)]"
              >
                <div
                  className="absolute -right-16 -top-16 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-25"
                  style={{ background: category.accent }}
                />
                <div className="flex items-start justify-between">
                  <span className="font-display text-sm" style={{ color: category.accent }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ArrowUpRight size={17} className="text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>
                <div>
                  <h3 className="font-serif-cn text-xl font-semibold text-ink transition-colors group-hover:text-accent sm:text-2xl">{category.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-faint">{category.description}</p>
                  <p className="mt-4 text-[10px] tracking-[0.16em] text-faint">{String(category.count).padStart(2, "0")} {messages["common.articles"]}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— archive + about ——— */}
      <section className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-6 sm:pt-32">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <SectionHeading index="03" title={messages["home.archiveTitle"]} href="/archive" linkLabel={messages["home.archiveLink"]} />
            <div className="mt-8">
              {archiveRows.map((post) => (
                <PostCard key={post.id} post={post} locale={locale} messages={messages} variant="row" />
              ))}
            </div>
            <Link href="/archive" className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.14em] text-muted transition-colors hover:text-accent">
              {messages["home.archiveLink"]} <ArrowRight size={13} />
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-[24px] border border-line bg-surface/35 p-7">
              <div className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full bg-accent/10 blur-3xl" />
              <div className="flex items-center gap-4">
                <img src={settings.avatarUrl} alt={authorName} className="size-16 rounded-full border border-line object-cover" />
                <div>
                  <p className="font-serif-cn text-lg text-ink">{authorName}</p>
                  <p className="mt-1 font-display text-[10px] tracking-[0.3em] text-faint">{settings.authorEn.toUpperCase()}</p>
                </div>
              </div>
              <p className="mt-6 text-sm leading-7 text-muted">{locale === "zh" ? settings.bio : messages["about.bio"]}</p>
              <div className="mt-6 border-t border-line pt-5">
                <p className="eyebrow">{messages["home.aboutNow"]}</p>
                <p className="mt-2 text-xs leading-6 text-faint">{locale === "zh" ? settings.nowText : messages["about.nowText"]}</p>
              </div>
              <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-accent">
                {messages["home.aboutLink"]} <ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— subscribe ——— */}
      <section className="mx-auto mt-24 max-w-[1240px] px-5 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(120deg,color-mix(in_srgb,var(--surface-solid)_70%,transparent),transparent)] px-6 py-14 text-center sm:px-16">
            <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <p className="eyebrow">Stay a little longer</p>
            <h2 className="mx-auto mt-5 max-w-2xl font-serif-cn text-3xl font-semibold leading-snug text-ink sm:text-4xl">
              {messages["home.subscribeTitle"]}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-faint">
              {messages["home.subscribeDesc"]}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/rss.xml" className="btn btn-primary">
                {messages["home.subscribeRss"]}
              </Link>
              <Link href="/archive" className="btn btn-ghost">
                {messages["home.subscribeArchive"]}
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}