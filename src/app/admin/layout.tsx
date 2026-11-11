import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "控制台",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg text-ink">{children}</div>;
}