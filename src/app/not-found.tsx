import Link from "next/link";
import { getI18n } from "@/i18n/server";

export const metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const { messages } = await getI18n();
  return (
    <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.07] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.03]" />
      </div>
      <p className="relative font-display text-sm tracking-[0.4em] text-faint">404 · LOST IN THE NIGHT</p>
      <h1 className="relative mt-6 font-serif-cn text-6xl font-semibold leading-tight text-ink sm:text-8xl">
        {messages["notFound.title"]}
      </h1>
      <p className="relative mt-5 max-w-md text-sm leading-7 text-muted">{messages["notFound.desc"]}</p>
      <div className="relative mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary">{messages["notFound.home"]}</Link>
        <Link href="/archive" className="btn btn-ghost">{messages["notFound.archive"]}</Link>
      </div>
      <p className="relative mt-16 font-display text-[10px] tracking-[0.32em] text-faint">{messages["notFound.foot"]}</p>
    </div>
  );
}