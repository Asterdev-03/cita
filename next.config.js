/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    // serverComponentsExternalPackages includes a list of dependencies that uses Node.js server specific features. So these are opted-out from the Next.js Server Components bundling and use native Node.js require.
    serverComponentsExternalPackages: ["cloudinary"],
  },
};

module.exports = nextConfig;
