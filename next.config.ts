/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "epwdgpvolriumeotwpss.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb', // ✅ เพิ่มขนาด Limit เป็น 10 MB
    },
  },
};

module.exports = nextConfig;
