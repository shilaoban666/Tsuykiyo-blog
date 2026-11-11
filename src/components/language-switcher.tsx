"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Translate } from "@phosphor-icons/react";
import { localeOptions, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale, label, compact = false }: { locale: Locale; label: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Locale | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function choose(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }
    setPending(next);
    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
      if (!response.ok) return;
      document.documentElement.lang = localeOptions.find((item) => item.code === next)?.htmlLang ?? next;
      setOpen(false);
      window.location.reload();
    } finally {
      setPending(null);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        aria-expanded={open}
        className={`inline-flex items-center justify-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-accent hover:text-accent ${
          compact ? "size-9" : "h-9 gap-1.5 px-3"
        }`}
      >
        <Translate size={16} weight="light" />
        {!compact ? <span className="font-display text-[10px] tracking-[0.1em]">{locale.toUpperCase()}</span> : null}
      </button>

      {open ? (
        <div className="pop-in absolute right-0 top-[calc(100%+10px)] z-[70] w-44 overflow-hidden rounded-xl border border-line bg-[var(--surface-solid)] p-1.5 shadow-2xl">
          <p className="px-3 py-2 font-display text-[9px] tracking-[0.24em] text-faint">{label.toUpperCase()}</p>
          {localeOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => choose(option.code)}
              disabled={pending !== null}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                option.code === locale ? "bg-accent/10 text-accent" : "text-muted hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-display text-[9px] tracking-[0.14em] text-faint">{option.code.toUpperCase()}</span>
                {option.native}
              </span>
              {option.code === locale || pending === option.code ? <Check size={13} weight="bold" /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}