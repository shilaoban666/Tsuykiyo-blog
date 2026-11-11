import { client } from "@/db";

export type AdminPost = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  status: string;
  featured: boolean;
  pinned: boolean;
  coverUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  readingMinutes: number;
  views: number;
  likes: number;
  publishedAt: string | null;
  updatedAt: string;
  tags: { id: string; name: string }[];
};

function iso(value: unknown) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : String(value);
}

export async function getDashboardData() {
  const [counts] = await client`
    SELECT
      (SELECT count(*)::int FROM posts) AS posts,
      (SELECT count(*)::int FROM posts WHERE status = 'published') AS published,
      (SELECT count(*)::int FROM posts WHERE status = 'draft') AS drafts,
      (SELECT count(*)::int FROM comments WHERE status = 'pending') AS pending_comments,
      (SELECT count(*)::int FROM comments) AS comments,
      (SELECT count(*)::int FROM media) AS media,
      (SELECT count(*)::int FROM categories) AS categories,
      (SELECT COALESCE(sum(views), 0)::int FROM posts) AS views,
      (SELECT count(*)::int FROM tags) AS tags
  `;

  const monthly = await client`
    SELECT to_char(date_trunc('month', published_at), 'YYYY-MM') AS month, count(*)::int AS count
    FROM posts
    WHERE status = 'published' AND published_at > now() - interval '8 months'
    GROUP BY 1 ORDER BY 1 ASC
  `;

  const recentPosts = await client`
    SELECT p.id, p.title, p.status, p.updated_at, c.name AS category_name
    FROM posts p LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.updated_at DESC LIMIT 6
  `;

  const recentComments = await client`
    SELECT cm.id, cm.author_name, cm.content, cm.status, cm.created_at, p.title AS post_title, p.slug AS post_slug
    FROM comments cm JOIN posts p ON p.id = cm.post_id
    ORDER BY cm.created_at DESC LIMIT 6
  `;

  const topPosts = await client`
    SELECT title, slug, views FROM posts WHERE status = 'published' ORDER BY views DESC LIMIT 5
  `;

  return {
    counts: {
      posts: counts.posts as number,
      published: counts.published as number,
      drafts: counts.drafts as number,
      pendingComments: counts.pending_comments as number,
      comments: counts.comments as number,
      media: counts.media as number,
      categories: counts.categories as number,
      views: counts.views as number,
      tags: counts.tags as number,
    },
    monthly: monthly.map((row) => ({ month: row.month as string, count: row.count as number })),
    recentPosts: recentPosts.map((row) => ({
      id: row.id as string,
      title: row.title as string,
      status: row.status as string,
      categoryName: row.category_name as string | null,
      updatedAt: iso(row.updated_at)!,
    })),
    recentComments: recentComments.map((row) => ({
      id: row.id as string,
      authorName: row.author_name as string,
      content: row.content as string,
      status: row.status as string,
      createdAt: iso(row.created_at)!,
      postTitle: row.post_title as string,
      postSlug: row.post_slug as string,
    })),
    topPosts: topPosts.map((row) => ({ title: row.title as string, slug: row.slug as string, views: row.views as number })),
  };
}

export async function listAdminPosts({ status, q }: { status?: string; q?: string } = {}) {
  const conditions = [client`true`];
  if (status && status !== "all") conditions.push(client`p.status = ${status}`);
  if (q) conditions.push(client`(p.title ILIKE ${`%${q}%`} OR p.slug ILIKE ${`%${q}%`})`);
  const where = conditions.slice(1).reduce((acc, part) => client`${acc} AND ${part}`, conditions[0]);

  const rows = await client`
    SELECT p.id, p.slug, p.title, p.subtitle, p.excerpt, p.status, p.featured, p.pinned,
      p.cover_url, p.category_id, p.reading_minutes, p.views, p.likes, p.published_at, p.updated_at,
      c.name AS category_name,
      COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', t.id, 'name', t.name)) FILTER (WHERE t.id IS NOT NULL), '[]'::jsonb) AS tags
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN post_tags pt ON pt.post_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
    WHERE ${where}
    GROUP BY p.id, c.name
    ORDER BY p.updated_at DESC
  `;

  return rows.map((row) => ({
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: row.subtitle as string | null,
    excerpt: row.excerpt as string | null,
    status: row.status as string,
    featured: row.featured as boolean,
    pinned: row.pinned as boolean,
    coverUrl: row.cover_url as string | null,
    categoryId: row.category_id as string | null,
    categoryName: row.category_name as string | null,
    readingMinutes: row.reading_minutes as number,
    views: row.views as number,
    likes: row.likes as number,
    publishedAt: iso(row.published_at),
    updatedAt: iso(row.updated_at)!,
    tags: (row.tags ?? []) as { id: string; name: string }[],
  })) satisfies AdminPost[];
}

export async function getAdminPost(id: string) {
  const [row] = await client`
    SELECT p.*, c.name AS category_name
    FROM posts p LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ${id} LIMIT 1
  `;
  if (!row) return null;
  const tagRows = await client`
    SELECT t.id, t.name FROM tags t JOIN post_tags pt ON pt.tag_id = t.id WHERE pt.post_id = ${id}
  `;
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: row.subtitle as string | null,
    excerpt: row.excerpt as string | null,
    content: row.content as string,
    coverUrl: row.cover_url as string | null,
    categoryId: row.category_id as string | null,
    status: row.status as string,
    featured: row.featured as boolean,
    pinned: row.pinned as boolean,
    seoTitle: row.seo_title as string | null,
    seoDescription: row.seo_description as string | null,
    publishedAt: iso(row.published_at),
    updatedAt: iso(row.updated_at)!,
    sourcePlatform: row.source_platform as string | null,
    sourceViews: row.source_views as number,
    sourceLikes: row.source_likes as number,
    sourceComments: row.source_comments as number,
    tags: tagRows.map((tag) => ({ id: tag.id as string, name: tag.name as string })),
  };
}

export async function listAdminComments(status?: string) {
  const conditions = status && status !== "all" ? client`WHERE cm.status = ${status}` : client``;
  const rows = await client`
    SELECT cm.id, cm.author_name, cm.author_email, cm.content, cm.status, cm.created_at,
      p.title AS post_title, p.slug AS post_slug
    FROM comments cm JOIN posts p ON p.id = cm.post_id
    ${conditions}
    ORDER BY cm.created_at DESC
    LIMIT 200
  `;
  return rows.map((row) => ({
    id: row.id as string,
    authorName: row.author_name as string,
    authorEmail: row.author_email as string | null,
    content: row.content as string,
    status: row.status as string,
    createdAt: iso(row.created_at)!,
    postTitle: row.post_title as string,
    postSlug: row.post_slug as string,
  }));
}

export async function listAdminMedia() {
  const rows = await client`SELECT * FROM media ORDER BY created_at DESC LIMIT 200`;
  return rows.map((row) => ({
    id: row.id as string,
    url: row.url as string,
    originalName: row.original_name as string,
    mimeType: row.mime_type as string,
    size: row.size as number,
    createdAt: iso(row.created_at)!,
  }));
}

export async function listAdminTaxonomies() {
  const categories = await client`
    SELECT c.*, count(p.id)::int AS count
    FROM categories c LEFT JOIN posts p ON p.category_id = c.id
    GROUP BY c.id ORDER BY c.sort ASC, c.name ASC
  `;
  const tags = await client`
    SELECT t.*, count(pt.post_id)::int AS count
    FROM tags t LEFT JOIN post_tags pt ON pt.tag_id = t.id
    GROUP BY t.id ORDER BY t.name ASC
  `;
  return {
    categories: categories.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      description: row.description as string | null,
      accent: row.accent as string,
      sort: row.sort as number,
      count: row.count as number,
    })),
    tags: tags.map((row) => ({
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      count: row.count as number,
    })),
  };
}