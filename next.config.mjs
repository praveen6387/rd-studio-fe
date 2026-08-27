const BACKEND = "https://rd-studio-be-production-atearna2.up.railway.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/rd-api/:path*",
          destination: `${BACKEND}/api/:path*`,
        },
        {
          source: "/media/:path*",
          destination: `${BACKEND}/media/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
