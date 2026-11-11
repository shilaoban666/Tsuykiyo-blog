import { listPosts } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const [settings, posts] = await Promise.all([getSettings(), listPosts({ limit: 30 })]);
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${absoluteUrl(`/posts/${post.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/posts/${post.slug}`)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : ""}</pubDate>
      ${post.categoryName ? `<category>${escapeXml(post.categoryName)}</category>` : ""}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(settings.siteName)} ${escapeXml(settings.siteEn)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escapeXml(settings.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=600",
    },
  });
}