import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/noto-serif-sc";
import { getLocale } from "@/i18n/server";
import { htmlLang } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "月白 TSUKIYO · 在月光与代码之间",
    template: "%s · 月白 TSUKIYO",
  },
  description:
    "月白 TSUKIYO 是一个二次元气质的个人博客与内容管理系统，记录文字、影像、动画与代码。",
  keywords: ["博客", "二次元", "设计", "前端", "独立开发", "月白", "TSUKIYO"],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "月白 TSUKIYO",
    title: "月白 TSUKIYO · 在月光与代码之间",
    description: "把夜色写成一页。关于代码、动画、城市与远方的海。",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "月白 TSUKIYO",
    description: "在月光与代码之间，留一页给幻想。",
    images: ["/og.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080f",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const themeScript = `(function(){try{var t=localStorage.getItem('tsukiyo-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}else{document.documentElement.dataset.theme='dark';}}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = getMessages(locale);
  return (
    <html lang={htmlLang(locale)} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--accent-ink)]"
        >
          {messages["common.skipToContent"]}
        </a>
        {children}
      </body>
    </html>
  );
}