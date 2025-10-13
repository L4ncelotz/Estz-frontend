import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ของเดิมที่ใส่ไว้สำหรับ Supabase
      {
        protocol: "https",
        hostname: "yidkvyrfzidbbllrpyoj.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      // เพิ่มอันนี้เข้าไปใหม่สำหรับ Discord
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/**", // อนุญาตทุก path ของ Discord CDN
      },
    ],
  },
  
  /* config options อื่นๆ ของคุณ (ถ้ามี) */

};

export default nextConfig;