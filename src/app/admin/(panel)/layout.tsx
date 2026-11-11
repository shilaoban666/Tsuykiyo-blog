import { redirect } from "next/navigation";
import { client } from "@/db";
import { getSessionUser } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";
export const metadata = { title: "控制台", robots: { index: false } };

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  const [row] = await client`SELECT count(*)::int AS count FROM comments WHERE status = 'pending'`;

  return (
    <AdminShell user={{ name: user.name, email: user.email }} pendingComments={row.count as number}>
      {children}
    </AdminShell>
  );
}