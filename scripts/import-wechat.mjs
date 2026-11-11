import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import gfmModule from "turndown-plugin-gfm";
import sharp from "sharp";

const gfm = gfmModule.gfm;
const sql = postgres("postgres://postgres:123456@127.0.0.1:5432/tsukiyo_blog", { max: 2 });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const MEDIA_ROOT = resolve("public", "imported", "wechat");
mkdirSync(MEDIA_ROOT, { recursive: true });
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
turndown.use(gfm);

function cleanText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input) {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (cleaned || `wechat-${Date.now()}`).slice(0, 70);
}

function shortId(url) {
  return url.split("/").pop()?.slice(0, 18) || createHash("md5").update(url).digest("hex").slice(0, 10);
}

async function fetchPage(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(url, { headers: { "user-agent": UA, "accept-language": "zh-CN,zh;q=0.9" } });
    const text = await response.text();
    if (response.status === 200 && text.includes("js_content")) return text;
    await new Promise((r) => setTimeout(r, 3000 + attempt * 3000));
  }
  return null;
}

async function downloadImage(src, directory, filename, size = "inline") {
  if (!src) return null;
  const url = src.startsWith("//") ? `https:${src}` : src;
  const target = resolve(directory, filename);
  try {
    const response = await fetch(url, { headers: { "user-agent": UA, referer: "https://mp.weixin.qq.com/" } });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (size === "cover") {
      await sharp(buffer).resize(1472, 981, { fit: "cover" }).webp({ quality: 87 }).toFile(target);
    } else {
      await sharp(buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
    }
    return target;
  } catch {
    return null;
  }
}

const links = readFileSync("wechat-import/links.txt", "utf8")
  .split(/\r?\n/)
  .map((line) => line.split("|")[0].trim())
  .filter((line) => line.startsWith("http"));

const [category] = await sql`
  INSERT INTO categories (slug, name, description, accent, sort)
  VALUES ('wechat-notes', '公众号文章', '「石哥说编程」公众号的文章。', '#ff7a92', 5)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
`;

let imported = 0;
for (const url of links) {
  console.log(`→ ${url}`);
  const html = await fetchPage(url);
  if (!html) {
    console.log("  ✗ 页面抓取失败");
    continue;
  }
  const root = parse(html);
  const title = root.querySelector("#activity-name")?.textContent?.trim() || root.querySelector('meta[property="og:title"]')?.getAttribute("content") || "未命名公众号文章";
  const description = cleanText(root.querySelector('meta[property="og:description"]')?.getAttribute("content") || "");
  const coverUrl = root.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
  const createTime = (html.match(/create_time:\s*'([^']+)'/) || [])[1];
  const content = root.querySelector("#js_content");
  if (!content) {
    console.log("  ✗ 正文不存在");
    continue;
  }
  content.querySelectorAll("script,style,noscript,iframe,video,svg,.js_ad_link,.reward_area,.rich_media_tool,.js_uneditable,.mp_common_profile,.js_profile_qrcode").forEach((node) => node.remove());

  const tableMarkdown = new Map();
  content.querySelectorAll("table").forEach((table, index) => {
    const rows = table.querySelectorAll("tr").map((row) =>
      row
        .querySelectorAll("th,td")
        .map((cell) => cell.textContent.replace(/\s+/g, " ").trim().replaceAll("|", "\\|")),
    );
    const header = rows[0] || [];
    const body = rows.slice(1);
    if (!header.length) {
      table.remove();
      return;
    }
    const lines = [
      `| ${header.join(" | ")} |`,
      `| ${header.map(() => "---").join(" | ")} |`,
      ...body.map((row) => `| ${row.join(" | ")} |`),
    ];
    const token = `[[WX_TABLE_${index}]]`;
    tableMarkdown.set(token, lines.join("\n"));
    table.replaceWith(parse(`<p>${token}</p>`));
  });

  const id = shortId(url);
  const directory = resolve(MEDIA_ROOT, id);
  mkdirSync(directory, { recursive: true });

  const coverLocal = await downloadImage(coverUrl, directory, "cover.webp", "cover");
  const images = content.querySelectorAll("img");
  let imageIndex = 0;
  for (const image of images) {
    const src = image.getAttribute("data-src") || image.getAttribute("src") || "";
    imageIndex += 1;
    const local = await downloadImage(src, directory, `img-${String(imageIndex).padStart(2, "0")}.webp`);
    if (!local) {
      image.remove();
      continue;
    }
    image.setAttribute("src", `/imported/wechat/${id}/img-${String(imageIndex).padStart(2, "0")}.webp`);
    image.removeAttribute("data-src");
    image.removeAttribute("srcset");
    image.removeAttribute("width");
    image.removeAttribute("height");
    image.setAttribute("alt", title);
  }

  let markdown = turndown.turndown(content.innerHTML)
    .replace(/登录后复制/g, "")
    .replace(/复制代码/g, "")
    .replace(/^#{1,6}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  for (const [token, table] of tableMarkdown) {
    const escaped = token.replace(/[[\]_]/g, (char) => `\\${char}`);
    markdown = markdown.split(token).join(table).split(escaped).join(table);
  }
  markdown = markdown.replace(/\n{3,}/g, "\n\n").trim();
  if (markdown.length < 100) {
    console.log("  ✗ 正文太短，跳过");
    continue;
  }

  const excerpt = (description || markdown.replace(/[#>*_`\[\]()]/g, " ").replace(/\s+/g, " ").trim()).slice(0, 180);
  const publishedAt = createTime ? new Date(`${createTime.replace(" ", "T")}+08:00`) : new Date();
  const readingMinutes = Math.max(1, Math.ceil((markdown.match(/[\u4e00-\u9fff]/g) || []).length / 320 + (markdown.match(/[A-Za-z0-9]+/g) || []).length / 220));
  const tags = ["公众号"];
  if (/进程/.test(title)) tags.push("进程", "Linux", "Java");
  if (/流式|Stream/i.test(title)) tags.push("Stream", "函数式编程", "Java");
  if (/CompletableFuture/i.test(title)) tags.push("CompletableFuture", "并发", "Java");

  let slug = slugify(title);
  const [conflict] = await sql`SELECT id FROM posts WHERE slug = ${slug} AND source_url <> ${url} LIMIT 1`;
  if (conflict) slug = `${slug}-${id}`;

  const [existing] = await sql`SELECT id FROM posts WHERE source_url = ${url} LIMIT 1`;
  let postId;
  if (existing) {
    postId = existing.id;
    await sql`
      UPDATE posts SET title = ${title}, excerpt = ${excerpt}, content = ${markdown},
        cover_url = ${coverLocal ? `/imported/wechat/${id}/cover.webp` : null},
        category_id = ${category.id}, status = 'published', reading_minutes = ${readingMinutes},
        published_at = ${publishedAt.toISOString()}, updated_at = now()
      WHERE id = ${existing.id}
    `;
  } else {
    const [row] = await sql`
      INSERT INTO posts (
        slug, title, excerpt, content, cover_url, category_id, status, featured, pinned,
        reading_minutes, views, likes, published_at, seo_description,
        source_platform, source_url, source_views, source_likes, source_comments
      ) VALUES (
        ${slug}, ${title}, ${excerpt}, ${markdown},
        ${coverLocal ? `/imported/wechat/${id}/cover.webp` : null}, ${category.id},
        'published', false, false, ${readingMinutes}, 0, 0, ${publishedAt.toISOString()}, ${excerpt},
        'wechat', ${url}, 0, 0, 0
      ) RETURNING id
    `;
    postId = row.id;
  }

  await sql`DELETE FROM post_tags WHERE post_id = ${postId}`;
  for (const name of [...new Set(tags)]) {
    const [tag] = await sql`
      INSERT INTO tags (name, slug) VALUES (${name}, ${slugify(name)})
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id
    `;
    await sql`INSERT INTO post_tags (post_id, tag_id) VALUES (${postId}, ${tag.id}) ON CONFLICT DO NOTHING`;
  }

  imported += 1;
  console.log(`  ✓ ${title}（${publishedAt.toISOString().slice(0, 10)}，${imageIndex} 张图）`);
}

console.log(`✓ 公众号导入完成：${imported}/${links.length}`);
await sql.end();