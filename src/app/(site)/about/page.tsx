import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, EnvelopeSimple, GithubLogo, MapPin, MusicNotes } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { getSettings } from "@/lib/settings";
import { getSiteStats } from "@/lib/posts";
import { getI18n } from "@/i18n/server";
import { aboutTimeline, displayAuthor } from "@/i18n/content";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["nav.about"] };
}

export default async function AboutPage() {
  const [{ locale, messages }, settings, stats] = await Promise.all([getI18n(), getSettings(), getSiteStats()]);
  const authorName = displayAuthor(locale, settings.authorName);
  const location = locale === "zh" ? settings.location : messages["about.location"];
  const intro = locale === "zh" ? settings.aboutIntro : messages["about.intro"];
  const nowText = locale === "zh" ? settings.nowText : messages["about.nowText"];
  const timeline = locale === "zh" ? settings.timeline : aboutTimeline[locale];

  return (
    <>
      <PageHeader
        eyebrow="About the person behind the moon"
        title={
          <>
            {messages["about.greeting"]}
            <br />
            {authorName}.
          </>
        }
        description={locale === "zh" ? settings.bio : messages["about.bio"]}
        meta={
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-faint">
            <span className="inline-flex items-center gap-1.5"><MapPin size={13} /> {location}</span>
            <span className="chip">{messages["about.roles"]}</span>
          </div>
        }
      />

      <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <Reveal>
            <div className="relative mx-auto max-w-[420px] md:max-w-none">
              <div className="absolute -inset-3 rounded-[32px] border border-line/60 sm:-inset-4" />
              <div className="relative overflow-hidden rounded-[26px] border border-line bg-surface/40">
                <img src={settings.avatarUrl} alt={authorName} className="aspect-square w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-6">
                  <p className="font-display text-sm tracking-[0.24em] text-white/90">{settings.authorEn.toUpperCase()}</p>
                  <p className="mt-1 text-[11px] text-white/55">{messages["about.authorRole"]}</p>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { value: stats.posts, label: messages["about.articlesLabel"] },
                  { value: stats.views, label: messages["about.viewsLabel"] },
                  { value: stats.comments, label: messages["about.commentsLabel"] },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-line bg-surface/25 p-3 text-center">
                    <p className="font-display text-xl text-ink">{item.value}</p>
                    <p className="mt-1 text-[9px] tracking-[0.16em] text-faint">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">A short introduction</p>
              <div className="mt-6 space-y-5 font-serif-cn text-base leading-9 text-muted">
                {intro.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-12 rounded-2xl border border-line bg-surface/25 p-6">
                <div className="flex items-center gap-2">
                  <span className="accent-dot" />
                  <p className="eyebrow">{messages["about.nowTitle"]}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-muted">{nowText}</p>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12">
                <p className="eyebrow">{messages["about.tools"]}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {settings.stack.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-12">
                <p className="eyebrow">{messages["about.timeline"]}</p>
                <div className="mt-5 space-y-0">
                  {timeline.map((entry, index) => (
                    <div key={`${entry.year}-${index}`} className="grid grid-cols-[64px_1fr] gap-4 border-t border-line py-5">
                      <span className="font-display text-lg text-accent">{entry.year}</span>
                      <div>
                        <p className="font-serif-cn text-base text-ink">{entry.title}</p>
                        <p className="mt-1 text-xs leading-6 text-faint">{entry.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="mt-24 grid gap-4 sm:grid-cols-3">
            <a href={settings.socials.github || "/about"} target={settings.socials.github ? "_blank" : undefined} rel="noreferrer" className="group rounded-2xl border border-line bg-surface/25 p-6 transition-colors hover:border-[var(--line-strong)]">
              <GithubLogo size={22} weight="light" className="text-muted" />
              <p className="mt-5 font-serif-cn text-lg text-ink">{messages["about.github"]}</p>
              <p className="mt-1 text-[11px] text-faint">{settings.socials.github ? settings.socials.github.replace(/^https?:\/\//, "").split("/")[0] : "github.com"}</p>
              <ArrowUpRight size={15} className="mt-5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a href={settings.socials.email ? `mailto:${settings.socials.email}` : "/about"} className="group rounded-2xl border border-line bg-surface/25 p-6 transition-colors hover:border-[var(--line-strong)]">
              <EnvelopeSimple size={22} weight="light" className="text-muted" />
              <p className="mt-5 font-serif-cn text-lg text-ink">Email</p>
              <p className="mt-1 text-[11px] text-faint">{messages["about.emailDesc"]}</p>
              <ArrowUpRight size={15} className="mt-5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <Link href="/rss.xml" className="group rounded-2xl border border-line bg-surface/25 p-6 transition-colors hover:border-[var(--line-strong)]">
              <MusicNotes size={22} weight="light" className="text-muted" />
              <p className="mt-5 font-serif-cn text-lg text-ink">RSS</p>
              <p className="mt-1 text-[11px] text-faint">{messages["about.rssDesc"]}</p>
              <ArrowUpRight size={15} className="mt-5 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}