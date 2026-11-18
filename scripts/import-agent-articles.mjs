import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";

const sql = postgres("postgres://postgres:123456@127.0.0.1:5432/tsukiyo_blog", { max: 2 });
const SOURCE_DIR = resolve("content", "agent-expanded");

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return { data: {}, body: text };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const item = /^([a-zA-Z_]+):\s*(.*)$/.exec(line.trim());
    if (!item) continue;
    const [, key, raw] = item;
    let value = raw.trim();
    try {
      value = JSON.parse(value);
    } catch {
      value = value.replace(/^"|"$/g, "");
    }
    data[key] = value;
  }
  return { data, body: match[2].trim() };
}

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const [category] = await sql`
  INSERT INTO categories (slug, name, description, accent, sort)
  VALUES ('agent-notes', 'Agent 手记', '关于 Agent、Harness 与 Superagent 的系统化写作。', '#8dd8e8', 3)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
`;

const files = readdirSync(SOURCE_DIR).filter((file) => file.endsWith(".md"));
const articles = files.map((file) => {
  const text = readFileSync(resolve(SOURCE_DIR, file), "utf8");
  const { data, body } = parseFrontmatter(text);
  return { file, data, body };
});
articles.sort((a, b) => String(a.data.id).localeCompare(String(b.data.id), "en", { numeric: true }));

let imported = 0;
for (let index = 0; index < articles.length; index += 1) {
  const { file, data, body } = articles[index];
  const title = String(data.title || file.replace(/\.md$/, ""));
  const slug = String(data.slug || file.replace(/\.md$/, ""));
  const series = String(data.series || "Agent");
  const audience = String(data.audience || "工程师");
  const thesis = String(data.thesis || "");
  const keywords = Array.isArray(data.keywords) ? data.keywords.map(String) : [];
  const chars = (body.match(/[\u4e00-\u9fff]/g) || []).length;
  const readingMinutes = Math.max(1, Math.ceil(chars / 350));
  const published = new Date(Date.UTC(2026, 9, 20 + index, 0, 0, 0));
  const excerpt = (thesis || body.replace(/[#>*_`\[\]()]/g, " ").replace(/\s+/g, " ").trim()).slice(0, 180);
  const content = `> 系列：${series} · 面向 ${audience}\n\n${body}`;
  const cover = `/art/generated/agents/${slug}.webp`;
  const tags = [...new Set([...keywords.slice(0, 5), series, "Agent"])].filter(Boolean);

  const [row] = await sql`
    INSERT INTO posts (
      slug, title, excerpt, content, cover_url, category_id, status, featured, pinned,
      reading_minutes, views, likes, published_at, seo_description
    ) VALUES (
      ${slug}, ${title}, ${excerpt}, ${content}, ${cover}, ${category.id},
      'published', false, false, ${readingMinutes}, 0, 0, ${published.toISOString()}, ${excerpt}
    )
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content,
      cover_url = EXCLUDED.cover_url, category_id = EXCLUDED.category_id,
      status = 'published', reading_minutes = EXCLUDED.reading_minutes,
      published_at = EXCLUDED.published_at, seo_description = EXCLUDED.seo_description,
      updated_at = now()
    RETURNING id
  `;

  await sql`DELETE FROM post_tags WHERE post_id = ${row.id}`;
  for (const name of tags) {
    const [tag] = await sql`
      INSERT INTO tags (name, slug) VALUES (${name}, ${slugify(name)})
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id
    `;
    await sql`INSERT INTO post_tags (post_id, tag_id) VALUES (${row.id}, ${tag.id}) ON CONFLICT DO NOTHING`;
  }

  imported += 1;
  console.log(`✓ ${data.id || ""} ${title} · ${chars} 字 · ${readingMinutes} 分钟`);
}

console.log(`完成：${imported}/${articles.length}`);
await sql.end();