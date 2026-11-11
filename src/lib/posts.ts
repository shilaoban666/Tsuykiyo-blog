import { client } from "@/db";

export type PostTag = { name: string; slug: string };

export type PostListItem = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  coverUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  categoryAccent: string | null;
  tags: PostTag[];
  publishedAt: string | null;
  readingMinutes: number;
  views: number;
  likes: number;
  featured: boolean;
  pinned: boolean;
};

export type PostDetail = PostListItem & {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  sourcePlatform: string | null;
  sourceUrl: string | null;
  sourceViews: number;
  sourceLikes: number;
  sourceComments: number;
  updatedAt: string;
  categoryDescription: string | null;
};

type Row = Record<string, any>;

function iso(value: unknown) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapList(row: Row): PostListItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt ?? "",
    coverUrl: row.cover_url,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categorySlug: row.category_slug,
    categoryAccent: row.category_accent,
    tags: Array.isArray(row.tags) ? row.tags : [],
    publishedAt: iso(row.published_at),
    readingMinutes: row.reading_minutes,
    views: row.views,
    likes: row.likes,
    featured: row.featured,
    pinned: row.pinned,
  };
}

function andAll(parts: any[]) {
  return parts.slice(1).reduce((acc, part) => client`${acc} AND ${part}`, parts[0]);
}

const listSelect = (sql: any) => sql`
  p.id, p.slug, p.title, p.subtitle, p.excerpt, p.cover_url, p.category_id, p.status,
  p.featured, p.pinned, p.reading_minutes, p.views, p.likes, p.published_at,
  c.name AS category_name, c.slug AS category_slug, c.accent AS category_accent,
  COALESCE(
    jsonb_agg(DISTINCT jsonb_build_object('name', t.name, 'slug', t.slug))
    FILTER (WHERE t.id IS NOT NULL),
    '[]'::jsonb
  ) AS tags
`;

const listJoins = (sql: any) => sql`
  FROM posts p
  LEFT JOIN categories c ON c.id = p.category_id
  LEFT JOIN post_tags pt ON pt.post_id = p.id
  LEFT JOIN tags t ON t.id = pt.tag_id
`;

export async function listPosts(options: {
  limit?: number;
  offset?: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  featured?: boolean;
} = {}) {
  const { limit = 12, offset = 0, categorySlug, tagSlug, search, featured } = options;
  const conditions = [client`p.status = 'published'`];
  if (categorySlug) conditions.push(client`c.slug = ${categorySlug}`);
  if (tagSlug) conditions.push(client`EXISTS (SELECT 1 FROM post_tags x JOIN tags xt ON xt.id = x.tag_id WHERE x.post_id = p.id AND xt.slug = ${tagSlug})`);
  if (search) {
    const term = `%${search}%`;
    conditions.push(client`(p.title ILIKE ${term} OR p.excerpt ILIKE ${term} OR p.content ILIKE ${term})`);
  }
  if (featured) conditions.push(client`p.featured = true`);
  const where = client`WHERE ${andAll(conditions)}`;

  const rows = await client`
    SELECT ${listSelect(client)}
    ${listJoins(client)}
    ${where}
    GROUP BY p.id, c.name, c.slug, c.accent
    ORDER BY p.pinned DESC, p.published_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  return rows.map(mapList);
}

export async function countPosts(options: { categorySlug?: string; tagSlug?: string; search?: string } = {}) {
  const conditions = [client`p.status = 'published'`];
  if (options.categorySlug) conditions.push(client`c.slug = ${options.categorySlug}`);
  if (options.tagSlug) conditions.push(client`EXISTS (SELECT 1 FROM post_tags x JOIN tags xt ON xt.id = x.tag_id WHERE x.post_id = p.id AND xt.slug = ${options.tagSlug})`);
  if (options.search) {
    const term = `%${options.search}%`;
    conditions.push(client`(p.title ILIKE ${term} OR p.excerpt ILIKE ${term} OR p.content ILIKE ${term})`);
  }
  const [row] = await client`
    SELECT count(*)::int AS count
    FROM posts p LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${andAll(conditions)}
  `;
  return row.count as number;
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const rows = await client`
    SELECT ${listSelect(client)}, p.content, p.seo_title, p.seo_description, p.updated_at,
      p.source_platform, p.source_url, p.source_views, p.source_likes, p.source_comments,
      c.description AS category_description
    ${listJoins(client)}
    WHERE p.slug = ${slug} AND p.status = 'published'
    GROUP BY p.id, c.name, c.slug, c.accent, c.description
    LIMIT 1
  `;
  if (!rows[0]) return null;
  const row = rows[0];
  return {
    ...mapList(row),
    content: row.content,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    sourcePlatform: row.source_platform,
    sourceUrl: row.source_url,
    sourceViews: row.source_views ?? 0,
    sourceLikes: row.source_likes ?? 0,
    sourceComments: row.source_comments ?? 0,
    updatedAt: iso(row.updated_at)!,
    categoryDescription: row.category_description,
  };
}

export async function getAdjacentPosts(publishedAt: string) {
  const [older] = await client`
    SELECT slug, title FROM posts
    WHERE status = 'published' AND published_at < ${publishedAt}
    ORDER BY published_at DESC LIMIT 1
  `;
  const [newer] = await client`
    SELECT slug, title FROM posts
    WHERE status = 'published' AND published_at > ${publishedAt}
    ORDER BY published_at ASC LIMIT 1
  `;
  return {
    older: older ? { slug: older.slug as string, title: older.title as string } : null,
    newer: newer ? { slug: newer.slug as string, title: newer.title as string } : null,
  };
}

export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3) {
  const rows = await client`
    SELECT ${listSelect(client)}
    ${listJoins(client)}
    WHERE p.status = 'published' AND p.id <> ${postId}
      AND (${categoryId ? client`p.category_id = ${categoryId}` : client`false`})
    GROUP BY p.id, c.name, c.slug, c.accent
    ORDER BY p.published_at DESC
    LIMIT ${limit}
  `;
  if (rows.length >= 2) return rows.map(mapList);
  const fallback = await client`
    SELECT ${listSelect(client)}
    ${listJoins(client)}
    WHERE p.status = 'published' AND p.id <> ${postId}
    GROUP BY p.id, c.name, c.slug, c.accent
    ORDER BY p.published_at DESC
    LIMIT ${limit}
  `;
  return fallback.map(mapList);
}

export async function getCategoriesWithCounts() {
  const rows = await client`
    SELECT c.id, c.slug, c.name, c.description, c.accent, c.sort,
      count(p.id)::int AS count
    FROM categories c
    LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
    GROUP BY c.id
    ORDER BY c.sort ASC, c.name ASC
  `;
  return rows.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    description: row.description as string | null,
    accent: row.accent as string,
    count: row.count as number,
  }));
}

export async function getTagsWithCounts(limit = 200) {
  const rows = await client`
    SELECT t.id, t.slug, t.name, count(p.id)::int AS count
    FROM tags t
    LEFT JOIN post_tags pt ON pt.tag_id = t.id
    LEFT JOIN posts p ON p.id = pt.post_id AND p.status = 'published'
    GROUP BY t.id
    HAVING count(p.id) > 0
    ORDER BY count DESC, t.name ASC
    LIMIT ${limit}
  `;
  return rows.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    count: row.count as number,
  }));
}

export async function getAllPublishedPosts() {
  return listPosts({ limit: 500 });
}

export async function getArchive() {
  const rows = await client`
    SELECT p.slug, p.title, p.published_at, p.reading_minutes,
      c.name AS category_name, c.slug AS category_slug
    FROM posts p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC
  `;
  const groups = new Map<string, { year: string; posts: { slug: string; title: string; date: string; category: string | null; categorySlug: string | null; minutes: number }[] }>();
  for (const row of rows) {
    const date = iso(row.published_at);
    const year = date ? date.slice(0, 4) : "—";
    if (!groups.has(year)) groups.set(year, { year, posts: [] });
    groups.get(year)!.posts.push({
      slug: row.slug as string,
      title: row.title as string,
      date: date ?? "",
      category: row.category_name as string | null,
      categorySlug: row.category_slug as string | null,
      minutes: row.reading_minutes as number,
    });
  }
  return [...groups.values()];
}

export async function getSiteStats() {
  const [row] = await client`
    SELECT
      (SELECT count(*)::int FROM posts WHERE status = 'published') AS posts,
      (SELECT count(*)::int FROM tags) AS tags,
      (SELECT count(*)::int FROM comments WHERE status = 'approved') AS comments,
      (SELECT COALESCE(sum(views), 0)::int FROM posts WHERE status = 'published') AS views,
      (SELECT count(*)::int FROM categories) AS categories
  `;
  return {
    posts: row.posts as number,
    tags: row.tags as number,
    comments: row.comments as number,
    views: row.views as number,
    categories: row.categories as number,
  };
}

export async function incrementViews(id: string) {
  await client`UPDATE posts SET views = views + 1 WHERE id = ${id}`;
}

export async function likePost(slug: string) {
  const [row] = await client`
    UPDATE posts SET likes = likes + 1
    WHERE slug = ${slug} AND status = 'published'
    RETURNING likes
  `;
  return (row?.likes as number) ?? null;
}

export type PublicComment = {
  id: string;
  parentId: string | null;
  authorName: string;
  authorWebsite: string | null;
  content: string;
  createdAt: string;
};

export async function getApprovedComments(postId: string): Promise<PublicComment[]> {
  const rows = await client`
    SELECT id, parent_id, author_name, author_website, content, created_at
    FROM comments
    WHERE post_id = ${postId} AND status = 'approved'
    ORDER BY created_at ASC
  `;
  return rows.map((row) => ({
    id: row.id as string,
    parentId: row.parent_id as string | null,
    authorName: row.author_name as string,
    authorWebsite: row.author_website as string | null,
    content: row.content as string,
    createdAt: iso(row.created_at)!,
  }));
}