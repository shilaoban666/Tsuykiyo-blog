"use client";

import { useEffect, useState } from "react";
import { Heart } from "@phosphor-icons/react";

export function LikeButton({
  slug,
  initialLikes,
  labels,
}: {
  slug: string;
  initialLikes: number;
  labels: { like: string; liked: string };
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setLiked(localStorage.getItem(`tsukiyo-liked:${slug}`) === "1");
  }, [slug]);

  async function like() {
    if (liked || pending) return;
    setPending(true);
    try {
      const response = await fetch(`/api/posts/${encodeURIComponent(slug)}/like`, { method: "POST" });
      if (!response.ok) return;
      const data = (await response.json()) as { likes: number };
      setLikes(data.likes);
      setLiked(true);
      localStorage.setItem(`tsukiyo-liked:${slug}`, "1");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={like}
      disabled={liked || pending}
      aria-label={liked ? labels.liked : labels.like}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all duration-300 ${
        liked ? "border-accent/40 bg-accent/10 text-accent" : "border-line text-muted hover:border-accent hover:text-accent"
      }`}
    >
      <span key={liked ? "liked" : "idle"} className={`relative grid place-items-center ${liked ? "like-burst" : ""}`}>
        <Heart size={15} weight={liked ? "fill" : "light"} />
      </span>
      {likes} {liked ? labels.liked : labels.like}
    </button>
  );
}