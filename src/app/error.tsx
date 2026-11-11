"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-xs tracking-[0.36em] text-faint">A QUIET ERROR</p>
      <h1 className="mt-5 font-serif-cn text-4xl text-ink">出了点小问题</h1>
      <p className="mt-3 max-w-md text-sm leading-7 text-muted">页面没有加载成功。可以重试一次，或者稍后再来。</p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">重新加载</button>
    </div>
  );
}