"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { ThemeToggle } from "./theme-toggle";
import { Logo } from "./logo";
import { LanguageSwitcher } from "./language-switcher";
import type { SiteSettings } from "@/lib/settings";
import type { Messages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";

export function SiteHeader({
  settings,
  locale,
  messages,
}: {
  settings: SiteSettings;
  locale: Locale;
  messages: Messages;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const nav = [
    { href: "/", label: messages["nav.home"] },
    { href: "/posts", label: messages["nav.posts"] },
    { href: "/archive", label: messages["nav.archive"] },
    { href: "/tags", label: messages["nav.tags"] },
    { href: "/about", label: messages["nav.about"] },
    { href: "/friends", label: messages["nav.friends"] },
    { href: "/products", label: messages["nav.products"] },
  ];

  const tagline =
    locale === "zh" ? settings.tagline : `${messages["home.tagline1"]} ${messages["home.tagline2"]}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header
        className={`site-header fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2.5" : "py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-4 sm:px-6">
          <div
            className={`flex w-full items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5 ${
              scrolled
                ? "border-line bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] shadow-[0_20px_60px_-30px_rgba(0,0,0,.8)] backdrop-blur-xl"
                : "border-transparent bg-transparent"
            }`}
          >
            <Logo name={settings.siteName} en={settings.siteEn} />

            <nav
              className="hidden items-center gap-0.5 md:flex lg:gap-1"
              aria-label={messages["nav.home"]}
              onMouseLeave={() => setHovered(null)}
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  className={`relative rounded-full px-2.5 py-2 text-[13px] tracking-wide transition-colors duration-300 lg:px-3.5 ${
                    isActive(item.href) ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--text)_7%,transparent)]"
                      transition={{ type: "spring", stiffness: 480, damping: 38 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                  {isActive(item.href) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2.5 -bottom-0.5 h-px bg-accent lg:inset-x-3.5"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <Link
                href="/search"
                aria-label={messages["common.search"]}
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-accent"
              >
                <MagnifyingGlass size={17} weight="light" />
              </Link>
              <LanguageSwitcher locale={locale} label={messages["common.language"]} />
              <ThemeToggle compact />
              <Link
                href="/admin"
                className="ml-1 hidden rounded-full border border-line px-3 py-2 text-[11px] tracking-[0.12em] text-muted transition-colors hover:border-accent hover:text-accent lg:inline-flex"
              >
                {messages["common.admin"]}
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={messages["common.menu"]}
                className="grid size-9 place-items-center rounded-full text-muted md:hidden"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        data-mobile-menu
        className={`fixed inset-0 z-[60] transition-all duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-2xl" onClick={() => setOpen(false)} />
        <div className={`mobile-menu-panel relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-5 transition-transform duration-500 ${open ? "translate-y-0" : "-translate-y-4"}`}>
          <div className="flex items-center justify-between">
            <Logo name={settings.siteName} en={settings.siteEn} />
            <button type="button" onClick={() => setOpen(false)} aria-label={messages["common.close"]} className="grid size-10 place-items-center rounded-full border border-line text-muted">
              <X size={20} />
            </button>
          </div>
          <nav className="mt-10 flex flex-col" aria-label={messages["nav.home"]}>
            {nav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-baseline justify-between border-b border-line py-4 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + index * 55}ms` : "0ms" }}
              >
                <span className={`font-serif-cn text-3xl ${isActive(item.href) ? "text-accent" : "text-ink"}`}>{item.label}</span>
                <span className="font-display text-xs tracking-[0.3em] text-faint">{String(index + 1).padStart(2, "0")}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between">
            <p className="max-w-[220px] text-xs leading-relaxed text-faint">{tagline}</p>
            <Link href="/admin" className="inline-flex items-center gap-1 text-xs text-muted">
              {messages["common.admin"]} <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}