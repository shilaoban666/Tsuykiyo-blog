import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MusicManager } from "@/components/admin/music-manager";
import { listAllMusicTracks } from "@/lib/music";

export const dynamic = "force-dynamic";

export default async function AdminMusicPage() {
  const tracks = await listAllMusicTracks();
  return (
    <div>
      <AdminPageHeader
        eyebrow="AMBIENCE / PLAYLIST"
        title="音乐"
        description="管理前台右下角的迷你播放器。默认不自动播放，访客点击后才会响起。"
      />
      <div className="mt-7">
        <MusicManager tracks={tracks} />
      </div>
    </div>
  );
}