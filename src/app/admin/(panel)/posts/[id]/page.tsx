import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";
import { getAdminPost, listAdminTaxonomies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, { categories, tags }] = await Promise.all([getAdminPost(id), listAdminTaxonomies()]);
  if (!post) notFound();
  return (
    <PostEditor
      post={{
        id: post.id,
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        excerpt: post.excerpt,
        content: post.content,
        coverUrl: post.coverUrl,
        categoryId: post.categoryId,
        status: post.status,
        featured: post.featured,
        pinned: post.pinned,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        sourcePlatform: post.sourcePlatform,
        sourceViews: post.sourceViews,
        sourceLikes: post.sourceLikes,
        sourceComments: post.sourceComments,
        tags: post.tags,
      }}
      categories={categories}
      allTags={tags}
    />
  );
}