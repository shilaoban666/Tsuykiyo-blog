"use client";

import { useState } from "react";
import { Check, LinkSimple } from "@phosphor-icons/react";

export function ShareButton({
  title,
  labels,
}: {
  title: string;
  labels: { share: string; copied: string };
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fall through to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-muted transition-colors hover:border-accent hover:text-accent">
      {copied ? <Check size={15} /> : <LinkSimple size={15} />}
      {copied ? labels.copied : labels.share}
    </button>
  );
}