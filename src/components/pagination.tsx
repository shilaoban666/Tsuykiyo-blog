import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
  previousLabel = "上一页",
  nextLabel = "下一页",
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  previousLabel?: string;
  nextLabel?: string;
}) {
  if (totalPages <= 1) return null;
  const href = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (value) => value === 1 || value === totalPages || Math.abs(value - page) <= 1,
  );

  return (
    <nav className="mt-16 flex items-center justify-center gap-2" aria-label="分页">
      {page > 1 ? (
        <Link href={href(page - 1)} className="rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent">
          {previousLabel}
        </Link>
      ) : (
        <span className="rounded-full border border-line/50 px-4 py-2 text-xs text-faint/40">{previousLabel}</span>
      )}
      {pages.map((value, index) => (
        <span key={value} className="flex items-center gap-2">
          {index > 0 && value - pages[index - 1] > 1 ? <span className="text-xs text-faint">…</span> : null}
          <Link
            href={href(value)}
            aria-current={value === page ? "page" : undefined}
            className={`grid size-9 place-items-center rounded-full border text-xs transition-colors ${
              value === page ? "border-accent bg-accent text-[var(--accent-ink)]" : "border-line text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {value}
          </Link>
        </span>
      ))}
      {page < totalPages ? (
        <Link href={href(page + 1)} className="rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent">
          {nextLabel}
        </Link>
      ) : (
        <span className="rounded-full border border-line/50 px-4 py-2 text-xs text-faint/40">{nextLabel}</span>
      )}
    </nav>
  );
}