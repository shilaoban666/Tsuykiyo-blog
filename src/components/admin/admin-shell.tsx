"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowSquareOut,
  ChartLineUp,
  ChatCircleDots,
  FolderSimple,
  Images,
  List,
  MusicNotes,
  SignOut,
  SlidersHorizontal,
  Tag,
  Article,
  X,
} from "@phosphor-icons/react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/admin", label: "总览", en: "Overview", icon: ChartLineUp },
  { href: "/admin/posts", label: "文章", en: "Posts", icon: Article },
  { href: "/admin/comments", label: "评论", en: "Comments", icon: ChatCircleDots },
  { href: "/admin/categories", label: "分类", en: "Categories", icon: FolderSimple },
  { href: "/admin/tags", label: "标签", en: "Tags", icon: Tag },
  { href: "/admin/music", label: "音乐", en: "Music", icon: MusicNotes },
  { href: "/admin/media", label: "媒体库", en: "Media", icon: Images },
  { href: "/admin/settings", label: "站点设置", en: "Settings", icon: SlidersHorizontal },
];

export function AdminShell({
  children,
  user,
  pendingComments,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
  pendingComments: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-6">
        <Logo name="月白" en="STUDIO" />
        <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-full border border-line text-muted lg:hidden" aria-label="关闭菜单">
          <X size={17} />
        </button>
      </div>
      <div className="mx-5 rounded-xl border border-line bg-surface/30 p-3">
        <p className="font-display text-[9px] tracking-[0.24em] text-faint">SIGNED IN AS</p>
        <p className="mt-1.5 truncate text-sm text-ink">{user.name}</p>
        <p className="truncate text-[10px] text-faint">{user.email}</p>
      </div>
      <nav className="mt-6 flex-1 space-y-1 overflow-y-auto px-3" aria-label="后台导航">
        {nav.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300 ${
                active ? "bg-accent/10 text-accent" : "text-muted hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <Icon size={18} weight={active ? "fill" : "light"} />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/comments" && pendingComments > 0 ? (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-[var(--accent-ink)]">{pendingComments}</span>
              ) : (
                <span className="font-display text-[9px] tracking-[0.14em] text-faint opacity-0 transition-opacity group-hover:opacity-100">{item.en}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-ink/5 hover:text-ink">
          <ArrowSquareOut size={18} weight="light" />
          查看站点
        </Link>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-ink/5 hover:text-ink">
          <SignOut size={18} weight="light" />
          退出登录
        </button>
        <div className="flex items-center justify-between px-3 pt-2">
          <span className="font-display text-[9px] tracking-[0.2em] text-faint">TSUKIYO CMS v1.0</span>
          <ThemeToggle compact />
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-shell min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-[var(--bg-elev)] lg:block">{sidebar}</aside>

      <div className="lg:hidden">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-[var(--bg)]/80 px-4 py-3 backdrop-blur-xl">
          <Logo name="月白" en="STUDIO" />
          <button type="button" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full border border-line text-muted" aria-label="打开菜单">
            <List size={19} />
          </button>
        </div>
        <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className={`relative h-full w-[280px] border-r border-line bg-[var(--bg-elev)] transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>{sidebar}</aside>
        </div>
      </div>

      <div className="min-w-0">
        <div className="admin-grid-bg pointer-events-none fixed inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  );
}