import Link from "next/link";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line px-6 py-20 text-center">
      <div className="relative mb-6 grid size-20 place-items-center rounded-full border border-line">
        <div className="absolute inset-2 rounded-full border border-dashed border-line" />
        <span className="font-display text-3xl text-accent">月</span>
      </div>
      <h2 className="font-serif-cn text-xl text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-faint">{description}</p>
      {action ? (
        <Link href={action.href} className="btn btn-ghost mt-6">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}