import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // async rewrites() {
  //   return [
  //     {
  //       // เมื่อมีการเรียก /api/... จากหน้าเว็บ
  //       source: '/api/:path*',
  //       // ให้ส่งต่อไปที่ Backend ในเครื่อง (เปลี่ยนพอร์ตให้ตรงกับ Backend ของคุณ)
  //       destination: 'http://localhost:8000/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
