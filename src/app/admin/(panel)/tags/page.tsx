import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TagsManager } from "@/components/admin/tags-manager";
import { listAdminTaxonomies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const { tags } = await listAdminTaxonomies();
  return (
    <div>
      <AdminPageHeader
        eyebrow="STRUCTURE / TAGS"
        title="标签"
        description="更细小的索引。标签之间会自然交叉，形成一张属于你的主题地图。"
      />
      <div className="mt-8">
        <TagsManager tags={tags} />
      </div>
    </div>
  );
}