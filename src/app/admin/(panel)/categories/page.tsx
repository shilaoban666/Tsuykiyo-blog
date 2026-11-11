import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { listAdminTaxonomies } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { categories } = await listAdminTaxonomies();
  return (
    <div>
      <AdminPageHeader
        eyebrow="STRUCTURE / CATEGORIES"
        title="分类"
        description="分类是房间，标签是窗户。这里的每个分类会出现在首页与导航中。"
      />
      <div className="mt-7">
        <CategoriesManager categories={categories} />
      </div>
    </div>
  );
}