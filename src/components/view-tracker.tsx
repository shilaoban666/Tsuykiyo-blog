"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `tsukiyo-viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/posts/${encodeURIComponent(slug)}/views`, { method: "POST" }).catch(() => {});
  }, [slug]);
  return null;
}