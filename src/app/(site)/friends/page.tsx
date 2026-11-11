import type { Metadata } from "next";
import { ArrowUpRight, EnvelopeSimple, GithubLogo, GlobeHemisphereWest } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { friends } from "@/content/site-links";
import { getSettings } from "@/lib/settings";
import { getI18n } from "@/i18n/server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getI18n();
  return { title: messages["friends.title"], description: messages["friends.desc"] };
}

export default async function FriendsPage() {
  const [{ locale, messages }, settings] = await Promise.all([getI18n(), getSettings()]);

  return (
    <>
      <PageHeader
        eyebrow="A small corner of the web"
        title={messages["friends.title"]}
        description={messages["friends.desc"]}
        meta={
          <div className="flex flex-wrap gap-3">
            <span className="chip">{friends.length} {messages["friends.site"]}</span>
            <span className="chip">{messages["friends.exchangeTitle"]}</span>
          </div>
        }
      />

      <div className="mx-auto max-w-[1160px] px-5 py-14 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {friends.map((friend, index) => {
            const description = locale === "zh" ? friend.description.zh : friend.description.en;
            const category = locale === "zh" ? friend.category.zh : friend.category.en;
            const domain = friend.url.replace(/^https?:\/\//, "").split("/")[0];
            return (
              <Reveal key={friend.name} delay={index * 0.04}>
                <a
                  href={friend.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface/25 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--line-strong)] hover:bg-surface/40"
                >
                  <span
                    className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-25"
                    style={{ background: friend.accent }}
                  />
                  <div>
                    <div className="flex items-start justify-between">
                      <span
                        className="grid size-11 place-items-center rounded-xl border border-line bg-surface/60 font-display text-[11px] tracking-[0.08em]"
                        style={{ color: friend.accent }}
                      >
                        {friend.monogram}
                      </span>
                      <ArrowUpRight size={16} className="text-faint transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </div>
                    <h2 className="mt-5 font-serif-cn text-xl font-semibold text-ink transition-colors group-hover:text-accent">{friend.name}</h2>
                    <p className="mt-1 text-[10px] tracking-[0.16em] text-faint">{category.toUpperCase()}</p>
                    <p className="mt-3 text-[13px] leading-6 text-muted">{description}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 border-t border-line pt-3 text-[10px] tracking-wide text-faint">
                    <GlobeHemisphereWest size={12} />
                    <span className="truncate">{domain}</span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="relative mt-16 overflow-hidden rounded-[28px] border border-line bg-surface/20 px-6 py-10 sm:px-10">
            <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-accent/[0.08] blur-3xl" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="font-display text-[10px] tracking-[0.24em] text-faint">LINK EXCHANGE</p>
                <h2 className="mt-3 font-serif-cn text-2xl font-semibold text-ink sm:text-3xl">{messages["friends.exchangeTitle"]}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{messages["friends.exchangeDesc"]}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {settings.socials.email ? (
                  <a href={`mailto:${settings.socials.email}`} className="btn btn-primary text-xs">
                    <EnvelopeSimple size={15} />
                    {settings.socials.email}
                  </a>
                ) : null}
                {settings.socials.github ? (
                  <a href={settings.socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost text-xs">
                    <GithubLogo size={15} weight="light" />
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}