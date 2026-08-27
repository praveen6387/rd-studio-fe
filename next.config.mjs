const BACKEND = "https://rd-studio-be-production-atearna2.up.railway.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return {
      beforeFiles: [
        // Django APPEND_SLASH: POSTs 500 if the proxied URL has no trailing slash.
        // Next.js :path* drops the slash, so restore it on the destination.
        {
          source: "/rd-api/:path*/",
          destination: `${BACKEND}/api/:path*/`,
        },
        {
          source: "/rd-api/:path*",
          destination: `${BACKEND}/api/:path*/`,
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
