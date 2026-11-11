import Link from "next/link";
import { ArrowUpRight, EnvelopeSimple, GithubLogo, Rss } from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/lib/settings";
import type { Messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";

export function SiteFooter({
  settings,
  locale,
  messages,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const tagline =
    locale === "zh" ? settings.tagline : `${messages["home.tagline1"]} ${messages["home.tagline2"]}`;
  const socials = [
    settings.socials.github && { href: settings.socials.github, label: "GitHub", icon: <GithubLogo size={16} weight="light" /> },
    settings.socials.email && { href: `mailto:${settings.socials.email}`, label: "Email", icon: <EnvelopeSimple size={16} weight="light" /> },
    { href: "/rss.xml", label: "RSS", icon: <Rss size={16} weight="light" /> },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode }[];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line pt-16">
      <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-serif-cn text-[26vw] leading-none text-ink/[0.035] sm:text-[20vw]">
        {settings.siteName}
      </div>
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow">A quiet corner on the internet</p>
            <p className="mt-5 max-w-sm font-serif-cn text-2xl leading-relaxed text-ink">
              {tagline}
            </p>
            <p className="mt-5 max-w-sm text-sm leading-7 text-faint">
              {locale === "zh" ? settings.footerText : messages["footer.copyright"]}
            </p>
            <div className="mt-7 flex items-center gap-2">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid size-10 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">{messages["footer.navigate"]}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                [messages["nav.posts"], "/posts"],
                [messages["nav.archive"], "/archive"],
                [messages["nav.tags"], "/tags"],
                [messages["nav.about"], "/about"],
                [messages["nav.friends"], "/friends"],
                [messages["nav.products"], "/products"],
                [messages["common.search"], "/search"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="group inline-flex items-center gap-1 text-muted transition-colors hover:text-ink">
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">{messages["footer.elsewhere"]}</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link href="/admin" className="text-muted transition-colors hover:text-ink">
                  {messages["footer.admin"]}
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="text-muted transition-colors hover:text-ink">
                  {messages["footer.rss"]}
                </Link>
              </li>
              <li>
                <span className="text-faint">{messages["footer.since"]} {settings.startDate}</span>
              </li>
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[10px] tracking-[0.16em] text-faint">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />
              {messages["footer.local"]}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line pb-24 pt-6 text-[11px] tracking-wide text-faint sm:flex-row sm:items-center sm:justify-between sm:pb-6 sm:pr-60 2xl:pr-0">
          <p>
            © {new Date().getFullYear()} {settings.siteName} {settings.siteEn}. {messages["footer.copyright"]}
          </p>
          <p className="flex items-center gap-3">
            {settings.icp ? <span>{settings.icp}</span> : null}
            <span>{messages["footer.built"]}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}