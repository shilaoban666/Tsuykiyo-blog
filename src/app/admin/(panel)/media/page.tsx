import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaLibrary } from "@/components/admin/media-library";
import { listAdminMedia } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await listAdminMedia();
  return (
    <div>
      <AdminPageHeader
        eyebrow="ASSETS / LIBRARY"
        title="媒体库"
        description="封面、插图与站点图片。文件保存在本地 data/uploads，数据库只存索引。"
      />
      <div className="mt-7">
        <MediaLibrary media={media} />
      </div>
    </div>
  );
}