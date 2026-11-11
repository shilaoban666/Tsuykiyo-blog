import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pb-14 pt-36 sm:pb-20 sm:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-16 size-[420px] rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="absolute left-1/3 top-0 h-px w-2/3 bg-gradient-to-r from-transparent via-line-strong to-transparent" />
        <span className="absolute right-4 top-24 select-none font-display text-[18vw] leading-none text-ink/[0.025] sm:right-10">月</span>
      </div>
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
        <p className="eyebrow animate-fade flex items-center gap-3">
          <span className="h-px w-8 bg-accent" /> {eyebrow}
        </p>
        <h1 className="animate-rise mt-6 max-w-4xl font-serif-cn text-5xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-6xl">
          {title}
        </h1>
        {description ? <p className="animate-rise mt-5 max-w-2xl text-sm leading-7 text-muted [animation-delay:110ms]">{description}</p> : null}
        {meta ? <div className="animate-rise mt-7 [animation-delay:200ms]">{meta}</div> : null}
        {children}
      </div>
    </header>
  );
}