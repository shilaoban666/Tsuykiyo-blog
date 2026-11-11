import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import postgres from "postgres";
import { parse } from "node-html-parser";
import TurndownService from "turndown";
import gfmModule from "turndown-plugin-gfm";
import sharp from "sharp";

const gfm = gfmModule.gfm;

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
      }
    } catch {
      // optional
    }
  }
}

loadEnv();
const connection = process.env.DATABASE_URL;
if (!connection) throw new Error("missing DATABASE_URL");
const sql = postgres(connection, { max: 2, prepare: false });

const USERNAME = "qq_45044477";
const LIST_URL = `https://blog.csdn.net/community/home-api/v1/get-business-list?page=1&size=100&businessType=blog&orderby=&noMore=false&year=&month=&username=${USERNAME}`;
const UA = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
];
const CACHE_DIR = resolve(process.cwd(), "data", "csdn-cache");
const MEDIA_ROOT = resolve(process.cwd(), "public", "imported", "csdn");
mkdirSync(CACHE_DIR, { recursive: true });
mkdirSync(MEDIA_ROOT, { recursive: true });

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "_",
});
turndown.use(gfm);

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

function cleanText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
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
  return (cleaned || `csdn-${Date.now()}`).slice(0, 70);
}

function chooseCover(tags, title) {
  const source = `${tags.join(" ")} ${title}`.toLowerCase();
  if (/java|spring|注解|反射|class|jmx|jpa|hibernate|netty/.test(source)) return "/art/generated/tech-java.webp";
  if (/mysql|hive|hadoop|hbase|数据库|sql/.test(source)) return "/art/generated/tech-db.webp";
  if (/算法|leetcode|华为|数据结构|hash|刷题/.test(source)) return "/art/generated/tech-algo.webp";
  if (/python|爬虫/.test(source)) return "/art/generated/tech-spring.webp";
  if (/echarts|前端|javascript|node/.test(source)) return "/art/generated/tech-algo.webp";
  if (/linux|windows|端口|进程|shell|命令/.test(source)) return "/art/generated/cover-studio.webp";
  return "/art/generated/cover-archive.webp";
}

function pickCategory(title, tags) {
  if (/恋爱|生活|随笔|现实/.test(title)) return "night-notes";
  return "code-notes";
}

async function fetchHtml(url, id) {
  const cachePath = resolve(CACHE_DIR, `${id}.html`);
  if (existsSync(cachePath)) {
    const cached = readFileSync(cachePath, "utf8");
    if (cached.includes("content_views")) return cached;
  }
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(`${url}?spm=${1000 + attempt * 17}.2115.3001.5343`, {
      headers: {
        "user-agent": UA[attempt % UA.length],
        referer: attempt % 2 ? "https://www.google.com/" : "https://blog.csdn.net/",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.7",
      },
    });
    const text = await response.text();
    if (response.status === 200 && text.includes("content_views")) {
      writeFileSync(cachePath, text, "utf8");
      return text;
    }
    console.log(`  · article ${id} status ${response.status}, retry ${attempt + 1}/6`);
    await sleep(8000 + attempt * 2500);
  }
  return null;
}

async function localizeImage(src, articleId, index) {
  if (!src || src.startsWith("data:")) return null;
  const url = src.startsWith("//") ? `https:${src}` : src;
  const hash = createHash("md5").update(url).digest("hex").slice(0, 12);
  const directory = resolve(MEDIA_ROOT, String(articleId));
  mkdirSync(directory, { recursive: true });
  const filename = `${String(index).padStart(2, "0")}-${hash}.webp`;
  const target = resolve(directory, filename);
  if (existsSync(target)) return `/imported/csdn/${articleId}/${filename}`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": UA[0], referer: "https://blog.csdn.net/" },
      });
      if (!response.ok) throw new Error(String(response.status));
      const buffer = Buffer.from(await response.arrayBuffer());
      await sharp(buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
      return `/imported/csdn/${articleId}/${filename}`;
    } catch {
      await sleep(1500 + attempt * 1000);
    }
  }
  return null;
}

async function convertArticle(html, article) {
  const root = parse(html);
  const content = root.querySelector("#content_views");
  if (!content) return null;

  content.querySelectorAll("script,style,noscript,iframe,button,svg,.hide-article-box,.recommend-box,.article-copyright,.more-toolbox,.toc,.hljs-button,.code-block-fullscreen,.pre-numbering,.login-mark").forEach((node) => node.remove());

  const images = content.querySelectorAll("img");
  const imageTasks = [];
  images.forEach((img, index) => {
    const src = img.getAttribute("data-src") || img.getAttribute("src") || "";
    if (!src) {
      img.remove();
      return;
    }
    imageTasks.push(
      localizeImage(src, article.articleId, index).then((local) => {
        if (!local) {
          img.remove();
          return;
        }
        img.setAttribute("src", local);
        img.removeAttribute("data-src");
        img.removeAttribute("srcset");
        img.removeAttribute("width");
        img.removeAttribute("height");
        if (!img.getAttribute("alt")) img.setAttribute("alt", "");
      }),
    );
  });
  await Promise.all(imageTasks);

  let markdown = turndown.turndown(content.innerHTML);
  markdown = markdown
    .replace(/登录后复制/g, "")
    .replace(/复制代码/g, "")
    .replace(/\[toc\]/gi, "")
    .replace(/\\([.*_#+\-])/g, "$1")
    .replace(/^#{1,6}\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
  return markdown;
}

async function main() {
  const limit = Number(process.env.CSDN_LIMIT || 0);
  console.log("→ 读取 CSDN 文章列表…");
  const listResponse = await fetch(LIST_URL, {
    headers: { "user-agent": UA[0], referer: `https://blog.csdn.net/${USERNAME}` },
  });
  const listData = await listResponse.json();
  let articles = listData.data.list.filter((item) => item.type === 1);
  if (limit > 0) articles = articles.slice(0, limit);
  console.log(`  共 ${articles.length} 篇`);

  const categoryRows = await sql`SELECT id, slug FROM categories`;
  const categoryMap = new Map(categoryRows.map((row) => [row.slug, row.id]));
  const defaultCategory = categoryMap.get("code-notes");
  if (!defaultCategory) throw new Error("missing category code-notes");

  let imported = 0;
  let failed = 0;
  for (let index = 0; index < articles.length; index += 1) {
    const article = articles[index];
    console.log(`→ [${index + 1}/${articles.length}] ${article.title}`);
    if (index > 0) await sleep(2200 + Math.floor(Math.random() * 1200));
    const html = await fetchHtml(article.url, article.articleId);
    if (!html) {
      console.log("  ✗ 页面被 WAF 拦截，跳过");
      failed += 1;
      continue;
    }
    const markdown = await convertArticle(html, article);
    if (!markdown || markdown.length < 80) {
      console.log("  ✗ 正文解析失败，跳过");
      failed += 1;
      continue;
    }

    const excerpt = cleanText(article.description).slice(0, 180);
    const slug = slugify(article.title);
    const tags = (article.tags || []).slice(0, 5).map((tag) => ({ name: tag, slug: slugify(tag) }));
    const publishedAt = new Date(`${article.postTime.replace(" ", "T")}+08:00`);
    const readingMinutes = Math.max(
      1,
      Math.ceil((markdown.match(/[\u4e00-\u9fff]/g) || []).length / 320 + (markdown.match(/[A-Za-z0-9]+/g) || []).length / 220),
    );
    const cover = chooseCover(article.tags || [], article.title);
    const categorySlug = pickCategory(article.title, article.tags || []);
    const categoryId = categoryMap.get(categorySlug) ?? defaultCategory;

    try {
      await sql.begin(async (tx) => {
        const [existing] = await tx`SELECT id, views FROM posts WHERE source_url = ${article.url} LIMIT 1`;
        let postId;
        if (existing) {
          postId = existing.id;
          await tx`
            UPDATE posts SET
              title = ${article.title}, excerpt = ${excerpt}, content = ${markdown},
              cover_url = ${cover}, category_id = ${categoryId}, status = 'published',
              reading_minutes = ${readingMinutes}, views = ${Math.max(Number(existing.views || 0), article.viewCount)},
              seo_description = ${excerpt}, published_at = ${publishedAt.toISOString()}, updated_at = now()
            WHERE id = ${existing.id}
          `;
        } else {
          let finalSlug = slug;
          const [conflict] = await tx`SELECT id FROM posts WHERE slug = ${finalSlug} LIMIT 1`;
          if (conflict) finalSlug = `${slug}-${article.articleId}`;
          const [row] = await tx`
            INSERT INTO posts (
              slug, title, excerpt, content, cover_url, category_id, status, featured, pinned,
              reading_minutes, views, likes, published_at, seo_description,
              source_platform, source_url, source_views, source_likes, source_comments
            ) VALUES (
              ${finalSlug}, ${article.title}, ${excerpt}, ${markdown}, ${cover}, ${categoryId},
              'published', false, false, ${readingMinutes}, ${article.viewCount}, ${article.diggCount},
              ${publishedAt.toISOString()}, ${excerpt},
              'csdn', ${article.url}, ${article.viewCount}, ${article.diggCount}, ${article.commentCount}
            ) RETURNING id
          `;
          postId = row.id;
        }

        await tx`DELETE FROM post_tags WHERE post_id = ${postId}`;
        for (const tag of tags) {
          const [tagRow] = await tx`
            INSERT INTO tags (name, slug) VALUES (${tag.name}, ${tag.slug})
            ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
            RETURNING id
          `;
          await tx`INSERT INTO post_tags (post_id, tag_id) VALUES (${postId}, ${tagRow.id}) ON CONFLICT DO NOTHING`;
        }
      });
      imported += 1;
      console.log(`  ✓ 已导入（${article.viewCount} 阅读）`);
    } catch (error) {
      failed += 1;
      console.log(`  ✗ 入库失败：${error.message}`);
    }
  }

  if (imported >= 20) {
    console.log("→ 将原示例文章转为草稿…");
    await sql`
      UPDATE posts SET status = 'draft', featured = false, pinned = false, updated_at = now()
      WHERE source_platform IS NULL AND source_url IS NULL
    `;
  }

  console.log(`✓ 完成：成功 ${imported} 篇，跳过 ${failed} 篇`);
  await sql.end();
}

main().catch(async (error) => {
  console.error(error);
  await sql.end();
  process.exit(1);
});