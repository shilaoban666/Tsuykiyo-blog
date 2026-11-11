"use client";

import { useEffect, useState } from "react";

export function TableOfContents({
  headings,
  labels,
}: {
  headings: { level: number; text: string; id: string }[];
  labels: { toc: string; note: string };
}) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (!headings.length) return;
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav aria-label="文章目录" className="sticky top-28">
      <p className="eyebrow flex items-center gap-2">
        <span className="h-px w-5 bg-accent" /> {labels.toc}
      </p>
      <ul className="mt-5 space-y-1 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`-ml-px block border-l py-1.5 pl-4 text-[12px] leading-5 transition-all duration-300 ${
                heading.level === 3 ? "pl-7" : ""
              } ${
                active === heading.id
                  ? "border-accent text-ink"
                  : "border-transparent text-faint hover:border-line-strong hover:text-muted"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-xl border border-line bg-surface/30 p-4">
        <p className="font-display text-xs tracking-[0.2em] text-faint">TSUKIYO NOTES</p>
        <p className="mt-2 text-[11px] leading-5 text-faint">{labels.note}</p>
      </div>
    </nav>
  );
}