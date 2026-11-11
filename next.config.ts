import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    // public 下的插画、导入图片、音频默认是 max-age=0，每次都要回源确认；改成一天强缓存 + 一周后台刷新
    return [
      {
        source: "/:dir(art|imported|audio)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;