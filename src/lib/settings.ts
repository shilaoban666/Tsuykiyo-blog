import { cache } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export type SocialLinks = {
  github?: string;
  x?: string;
  email?: string;
  bilibili?: string;
  weibo?: string;
};

export type TimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type SiteSettings = {
  siteName: string;
  siteEn: string;
  tagline: string;
  description: string;
  authorName: string;
  authorEn: string;
  bio: string;
  avatarUrl: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  startDate: string;
  location: string;
  nowText: string;
  aboutIntro: string;
  stack: string[];
  timeline: TimelineEntry[];
  socials: SocialLinks;
  commentsEnabled: boolean;
  footerText: string;
  icp: string;
};

export const defaultSettings: SiteSettings = {
  siteName: "月白",
  siteEn: "TSUKIYO",
  tagline: "在月光与代码之间，留一页给幻想。",
  description: "一个月白风格的二次元个人博客，记录文字、影像与代码。",
  authorName: "月白主人",
  authorEn: "Tsukiyo",
  bio: "写作者、独立开发者、深夜动画观众。",
  avatarUrl: "/art/generated/avatar-writer.webp",
  heroEyebrow: "A QUIET PLACE BETWEEN MOONLIGHT AND CODE",
  heroTitle: "把夜色 / 写成一页",
  heroSubtitle:
    "这里收集散落在深夜的念头：关于代码、动画、城市与远方的海。愿你在此停留片刻，听见月光落下的声音。",
  announcement: "新站已上线。评论需要经过审核，感谢你的耐心。",
  startDate: "2020-05-17",
  location: "杭州 · 中国",
  nowText: "正在写一个关于记忆与城市的小说，也在维护这套博客系统。",
  aboutIntro:
    "白天写代码，夜里写字。相信好的界面应该像月光：不喧哗，却能照亮该被看见的东西。这个空间用来存放长期主义的作品，以及那些不愿意被信息流冲走的瞬间。",
  stack: ["TypeScript", "Next.js", "PostgreSQL", "Figma", "Framer Motion"],
  timeline: [
    { year: "2026", title: "月白 TSUKIYO 上线", description: "把博客重写成一套完整的写作与内容管理系统。" },
    { year: "2025", title: "开始认真写作", description: "停止追逐更新频率，转向更长、更慢的文章。" },
    { year: "2024", title: "第一次独立开发", description: "从前端走向全栈，开始独立维护自己的产品。" },
  ],
  socials: {
    github: "https://github.com",
    email: "hello@example.com",
    bilibili: "https://space.bilibili.com",
  },
  commentsEnabled: true,
  footerText: "月光不问归期，代码不问深夜。",
  icp: "",
};

function mergeSettings(value: unknown): SiteSettings {
  if (!value || typeof value !== "object") return defaultSettings;
  const partial = value as Partial<SiteSettings>;
  return {
    ...defaultSettings,
    ...partial,
    socials: { ...defaultSettings.socials, ...(partial.socials ?? {}) },
    stack: Array.isArray(partial.stack) ? partial.stack : defaultSettings.stack,
    timeline: Array.isArray(partial.timeline) ? partial.timeline : defaultSettings.timeline,
  };
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db
    .select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, "site"))
    .limit(1);
  return mergeSettings(rows[0]?.value);
});