"use client";

import { useEffect, useRef, useState } from "react";

/** 把 "33" / "05" / "39.9k" 这类字符串从 0 滚动到目标值，保留补零、小数位和后缀。 */
export function CountUp({ value, duration = 1600, delay = 500 }: { value: string; duration?: number; delay?: number }) {
  const [text, setText] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/^(\d+)(?:\.(\d+))?(.*)$/);
    if (!match || started.current) return;
    started.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const int = match[1];
    const frac = match[2] ?? "";
    const suffix = match[3];
    const target = Number(`${int}.${frac || "0"}`);
    const format = (n: number) => {
      const [i, f] = n.toFixed(frac.length).split(".");
      return `${i.padStart(int.length, "0")}${f ? `.${f}` : ""}${suffix}`;
    };
    let frame = 0;
    let start = 0;
    setText(format(0));
    const tick = (now: number) => {
      if (!start) start = now + delay;
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 4);
      setText(t >= 1 ? value : format(target * eased));
      if (t < 1) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value, duration, delay]);

  return <span className="tabular-nums">{text}</span>;
}
