import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const intlLocales: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  de: "de-DE",
  fr: "fr-FR",
  es: "es-ES",
  ko: "ko-KR",
};

export function formatDate(value: Date | string | null | undefined, locale: Locale = "zh") {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocales[locale] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(date);
}

export function formatShortDate(value: Date | string | null | undefined, locale: Locale = "zh") {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(intlLocales[locale] ?? "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Shanghai",
  })
    .format(date)
    .replaceAll("/", ".");
}

export function readingMinutes(markdown: string) {
  const chinese = (markdown.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const words = (markdown.match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(chinese / 320 + words / 220));
}

export function slugify(input: string) {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || `note-${Date.now().toString(36)}`;
}

export function excerptFromMarkdown(markdown: string, length = 120) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > length ? `${plain.slice(0, length)}…` : plain;
}

export function formatCount(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

export function decodeParam(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}