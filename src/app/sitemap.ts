import type { MetadataRoute } from "next";
import { getCategoriesWithCounts, getTagsWithCounts, listPosts } from "@/lib/posts";
import { products } from "@/content/site-links";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    listPosts({ limit: 500 }),
    getCategoriesWithCounts(),
    getTagsWithCounts(),
  ]);

  const staticRoutes = ["", "/posts", "/archive", "/tags", "/about", "/friends", "/products", "/search"].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...products.map((product) => ({
      url: absoluteUrl(`/products/${product.id}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...tags.map((tag) => ({
      url: absoluteUrl(`/tags/${tag.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}