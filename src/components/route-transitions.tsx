"use client";

import { startTransition, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

/** 只处理前台页面之间的普通左键跳转，其余交给浏览器 / next/link。 */
function internalTarget(event: MouseEvent | PointerEvent | TouchEvent): { anchor: HTMLAnchorElement; url: URL } | null {
  const anchor = (event.target as HTMLElement | null)?.closest?.("a");
  if (!anchor || !anchor.href || anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  if (/^\/(admin|api)(\/|$)|\.xml$/.test(url.pathname)) return null;
  if (url.pathname === window.location.pathname && url.search === window.location.search) return null;
  return { anchor, url };
}

/**
 * 1. 悬停 / 触摸时提前把目标页整页预取好，点击时几乎零等待。
 * 2. 普通跳转：点击瞬间旧内容就开始淡出，新内容到了再淡入。全程不冻结页面，所以不会"卡一下"。
 * 3. 文章卡片 → 文章页：用 View Transitions 让封面图直接长成文章头图。
 */
export function RouteTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const settle = useRef<(() => void) | null>(null);
  const leaveTimer = useRef(0);

  // 新页面提交后、绘制前：撤掉淡出状态，放行封面转场
  useLayoutEffect(() => {
    window.clearTimeout(leaveTimer.current);
    document.documentElement.classList.remove("nav-leaving");
    settle.current?.();
    settle.current = null;
  }, [pathname, search]);

  useEffect(() => {
    const prefetched = new Set<string>();
    let intent = 0;

    const prefetch = (url: URL) => {
      const href = url.pathname + url.search;
      if (prefetched.has(href)) return;
      prefetched.add(href);
      try {
        router.prefetch(href, { kind: PrefetchKind.FULL });
      } catch {
        // 预取失败不影响正常跳转
      }
    };

    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = internalTarget(event);
      window.clearTimeout(intent);
      if (target) intent = window.setTimeout(() => prefetch(target.url), 50);
    };
    const onTouch = (event: TouchEvent) => {
      const target = internalTarget(event);
      if (target) prefetch(target.url);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = internalTarget(event);
      if (!target) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const { anchor, url } = target;
      const root = document.documentElement;
      const cover = url.pathname.startsWith("/posts/")
        ? anchor.closest("article")?.querySelector<HTMLElement>(".image-cover")
        : null;

      if (!cover || typeof document.startViewTransition !== "function") {
        // 不拦截点击，跳转照常由 next/link 完成；这里只让旧内容立刻开始淡出
        root.classList.add("nav-leaving");
        window.clearTimeout(leaveTimer.current);
        leaveTimer.current = window.setTimeout(() => root.classList.remove("nav-leaving"), 1500);
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      cover.style.viewTransitionName = "post-cover";
      root.classList.add("vt-nav");
      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            settle.current = resolve;
            window.setTimeout(resolve, 2000);
            startTransition(() => router.push(url.pathname + url.search + url.hash));
          }),
      );
      transition.finished.finally(() => {
        root.classList.remove("vt-nav");
        cover.style.viewTransitionName = "";
      });
    };

    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("touchstart", onTouch, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      window.clearTimeout(intent);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return null;
}
