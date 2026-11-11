import type { ReactNode } from "react";

// template 在每次路由切换时重新挂载，借此给每个页面一个统一的入场动画。
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
