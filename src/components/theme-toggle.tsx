"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { MoonStars, SunDim } from "@phosphor-icons/react";

type Theme = "dark" | "light";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "dark";
    setTheme(current);
  }, []);

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
    localStorage.setItem("tsukiyo-theme", next);
    setTheme(next);
  }

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof document.startViewTransition !== "function") {
      apply(next);
      return;
    }

    // 新主题从按钮位置以圆形晕开，像月光 / 晨光漫过整页
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const root = document.documentElement;
    root.classList.add("theme-switching");
    const transition = document.startViewTransition(() => {
      flushSync(() => apply(next));
    });
    transition.ready
      .then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 750, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    transition.finished.finally(() => root.classList.remove("theme-switching"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "切换到晨光模式" : "切换到夜色模式"}
      className={`group relative inline-flex items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent ${
        compact ? "size-9" : "size-10"
      }`}
    >
      <span className="absolute inset-0 rounded-full bg-accent/0 transition-colors duration-300 group-hover:bg-accent/5" />
      <span key={theme} className="theme-icon grid place-items-center">
        {theme === "dark" ? <SunDim size={17} weight="light" /> : <MoonStars size={17} weight="light" />}
      </span>
    </button>
  );
}
