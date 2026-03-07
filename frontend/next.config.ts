import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ถ้าเปิดใช้ API Proxy (เมื่อเรียก /api ให้ยิงไปหา Backend อัตโนมัติ) ให้เอา Comment // ออก
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*' || 'http://localhost:8000/api/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
