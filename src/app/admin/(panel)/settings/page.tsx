import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AccountForm, SettingsForm } from "@/components/admin/settings-form";
import { getSessionUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, user] = await Promise.all([getSettings(), getSessionUser()]);
  return (
    <div>
      <AdminPageHeader
        eyebrow="SYSTEM / CONFIGURATION"
        title="站点设置"
        description="改这里，整个站点的身份、首页文案与关于页都会一起变化。"
      />
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
      <div className="mt-8">
        {user ? <AccountForm user={{ name: user.name, email: user.email }} /> : null}
      </div>
    </div>
  );
}