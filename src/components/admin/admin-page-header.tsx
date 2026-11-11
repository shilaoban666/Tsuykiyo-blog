export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-7">
      <div>
        <p className="font-display text-[10px] tracking-[0.28em] text-faint">{eyebrow}</p>
        <h1 className="mt-3 font-serif-cn text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-faint">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    published: { label: "已发布", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
    draft: { label: "草稿", className: "border-amber-400/30 bg-amber-400/10 text-amber-300" },
    pending: { label: "待审核", className: "border-amber-400/30 bg-amber-400/10 text-amber-300" },
    approved: { label: "已通过", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
    spam: { label: "垃圾", className: "border-red-400/30 bg-red-400/10 text-red-300" },
  };
  const item = map[status] ?? { label: status, className: "border-line text-muted" };
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wide ${item.className}`}>{item.label}</span>;
}