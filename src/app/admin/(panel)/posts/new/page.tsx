import { PostEditor } from "@/components/admin/post-editor";
import { listAdminTaxonomies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const { categories, tags } = await listAdminTaxonomies();
  return <PostEditor post={null} categories={categories} allTags={tags} />;
}