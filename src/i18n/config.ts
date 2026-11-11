export const locales = ["zh", "en", "ja", "de", "fr", "es", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "tsukiyo_locale";

export const localeOptions: { code: Locale; native: string; english: string; htmlLang: string }[] = [
  { code: "zh", native: "中文", english: "Chinese", htmlLang: "zh-CN" },
  { code: "en", native: "English", english: "English", htmlLang: "en" },
  { code: "ja", native: "日本語", english: "Japanese", htmlLang: "ja" },
  { code: "de", native: "Deutsch", english: "German", htmlLang: "de" },
  { code: "fr", native: "Français", english: "French", htmlLang: "fr" },
  { code: "es", native: "Español", english: "Spanish", htmlLang: "es" },
  { code: "ko", native: "한국어", english: "Korean", htmlLang: "ko" },
];

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && (locales as readonly string[]).includes(value));
}

export function htmlLang(locale: Locale) {
  return localeOptions.find((item) => item.code === locale)?.htmlLang ?? "en";
}

export function detectLocale(acceptLanguage?: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const tags = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);
  for (const { tag } of tags) {
    const short = tag.split("-")[0];
    if (isLocale(short)) return short;
  }
  return defaultLocale;
}