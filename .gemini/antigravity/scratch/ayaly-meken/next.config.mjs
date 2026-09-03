/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable gzip/brotli compression
  compress: true,
  experimental: {
    // Tree-shake large icon/utility libraries — reduces shared JS chunk size
    optimizePackageImports: ["lucide-react", "date-fns", "@radix-ui/react-dialog", "@radix-ui/react-select"],
  },
  images: {
    // Enable WebP/AVIF format conversion
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
