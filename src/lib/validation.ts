import { z } from "zod";

export const postSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().max(160).optional().default(""),
  subtitle: z.string().trim().max(240).optional().default(""),
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.string().max(200000).optional().default(""),
  coverUrl: z.string().trim().max(500).optional().default(""),
  categoryId: z.string().uuid().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().optional().default(false),
  pinned: z.boolean().optional().default(false),
  seoTitle: z.string().trim().max(160).optional().default(""),
  seoDescription: z.string().trim().max(300).optional().default(""),
  tagIds: z.array(z.string().uuid()).max(20).optional().default([]),
  sourceViews: z.number().int().min(0).max(100000000).optional().default(0),
  sourceLikes: z.number().int().min(0).max(100000000).optional().default(0),
  sourceComments: z.number().int().min(0).max(100000000).optional().default(0),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(40),
  slug: z.string().trim().max(80).optional().default(""),
  description: z.string().trim().max(300).optional().default(""),
  accent: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#ff6b8a"),
  sort: z.number().int().min(0).max(999).optional().default(0),
});

export const tagSchema = z.object({
  name: z.string().trim().min(1).max(40),
  slug: z.string().trim().max(80).optional().default(""),
});

export const musicSchema = z.object({
  title: z.string().trim().min(1).max(120),
  artist: z.string().trim().max(120).optional().default(""),
  album: z.string().trim().max(120).optional().default(""),
  coverUrl: z.string().trim().max(500).optional().default(""),
  audioUrl: z.string().trim().min(1).max(1000),
  sort: z.number().int().min(0).max(999).optional().default(0),
  enabled: z.boolean().optional().default(true),
});

export const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(40),
  siteEn: z.string().trim().min(1).max(40),
  tagline: z.string().trim().max(160),
  description: z.string().trim().max(500),
  authorName: z.string().trim().min(1).max(60),
  authorEn: z.string().trim().max(60),
  bio: z.string().trim().max(300),
  avatarUrl: z.string().trim().max(500),
  heroEyebrow: z.string().trim().max(120),
  heroTitle: z.string().trim().max(80),
  heroSubtitle: z.string().trim().max(400),
  announcement: z.string().trim().max(200),
  startDate: z.string().trim().max(20),
  location: z.string().trim().max(80),
  nowText: z.string().trim().max(400),
  aboutIntro: z.string().trim().max(4000),
  stack: z.array(z.string().trim().max(40)).max(30),
  timeline: z.array(z.object({ year: z.string().trim().max(10), title: z.string().trim().max(80), description: z.string().trim().max(300) })).max(30),
  socials: z.object({
    github: z.string().trim().max(300).optional().default(""),
    x: z.string().trim().max(300).optional().default(""),
    email: z.string().trim().max(200).optional().default(""),
    bilibili: z.string().trim().max(300).optional().default(""),
    weibo: z.string().trim().max(300).optional().default(""),
  }),
  commentsEnabled: z.boolean(),
  footerText: z.string().trim().max(200),
  icp: z.string().trim().max(100),
});