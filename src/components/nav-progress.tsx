"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type Phase = "idle" | "loading" | "done";

/** 点击站内链接后在顶部显示一条细进度线，页面到达后收尾淡出。 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [phase, setPhase] = useState<Phase>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (timer.current) window.clearTimeout(timer.current);
      setPhase("loading");
      // 兜底：导航被取消或失败时不让进度线一直挂着
      timer.current = window.setTimeout(() => setPhase("idle"), 12000);
    };
    // 捕获阶段监听：next/link 会在冒泡阶段 preventDefault，晚了就分辨不出来
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setPhase((current) => (current === "loading" ? "done" : current));
    timer.current = window.setTimeout(() => setPhase("idle"), 450);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [pathname, search]);

  return <div className="nav-progress" data-phase={phase} aria-hidden />;
}
