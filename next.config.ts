import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://evcomp-api:8080/api'}/:path*`
      }
    ]
  }
};

export default nextConfig;
