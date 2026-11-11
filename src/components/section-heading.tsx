import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function SectionHeading({
  index,
  title,
  description,
  href,
  linkLabel = "查看全部",
  className = "",
}: {
  index: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-6 ${className}`}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm text-accent">{index}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="eyebrow">Archive of feelings</span>
        </div>
        <h2 className="mt-4 font-serif-cn text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {description ? <p className="mt-3 max-w-xl text-sm leading-7 text-faint">{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent">
          {linkLabel}
          <ArrowRight size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}