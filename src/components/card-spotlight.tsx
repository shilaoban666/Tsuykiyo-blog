"use client";

import { useEffect } from "react";

/**
 * 卡片指针动效（仅桌面精确指针）：跟随指针的柔光 + 轻微 3D 倾斜。
 * 只挂一个 pointermove 监听，写 CSS 变量，不触发布局。
 */
export function CardSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last: PointerEvent | null = null;
    let card: HTMLElement | null = null;

    const resetCard = () => {
      if (!card) return;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card = null;
    };

    const apply = () => {
      frame = 0;
      if (!last) return;
      const nextCard = (last.target as HTMLElement | null)?.closest?.<HTMLElement>(".card-hover") ?? null;
      if (nextCard !== card) resetCard();
      if (!nextCard) return;
      card = nextCard;
      const rect = nextCard.getBoundingClientRect();
      const px = (last.clientX - rect.left) / rect.width;
      const py = (last.clientY - rect.top) / rect.height;
      nextCard.style.setProperty("--mx", `${last.clientX - rect.left}px`);
      nextCard.style.setProperty("--my", `${last.clientY - rect.top}px`);
      nextCard.style.setProperty("--ry", `${(px - 0.5) * 5}deg`);
      nextCard.style.setProperty("--rx", `${(0.5 - py) * 5}deg`);
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = window.requestAnimationFrame(apply);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetCard);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", resetCard);
      if (frame) window.cancelAnimationFrame(frame);
      resetCard();
    };
  }, []);
  return null;
}
