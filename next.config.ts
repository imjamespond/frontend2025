import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 1. Next.js 会为每个路由生成 HTML 文件，因此访问者无需等待客户端 JavaScript 包即可更快获取内容。
  // 2. 不同于所有路由的最小骨架，您获得每个路由的完整渲染页面。当用户客户端导航时，切换保持即时且类似 SPA。
  //  output: 'export', 
};

export default nextConfig;
