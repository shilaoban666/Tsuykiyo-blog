import Link from "next/link";

export function Logo({ name = "月白", en = "TSUKIYO", compact = false }: { name?: string; en?: string; compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label={`${name} 首页`}>
      <span className="relative grid size-9 place-items-center rounded-full border border-line-strong bg-[var(--surface)]">
        <svg viewBox="0 0 32 32" className="size-5 text-accent transition-transform duration-700 group-hover:rotate-[-18deg]" aria-hidden>
          <path
            d="M21.7 5.2a11 11 0 1 0 5.1 17.6A9.2 9.2 0 0 1 21.7 5.2Z"
            fill="currentColor"
            opacity=".92"
          />
          <circle cx="24.6" cy="7.2" r="1.2" fill="currentColor" opacity=".55" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-serif-cn text-[17px] font-semibold tracking-[0.16em] text-ink">{name}</span>
          <span className="mt-1 font-display text-[9px] tracking-[0.34em] text-faint">{en}</span>
        </span>
      )}
    </Link>
  );
}