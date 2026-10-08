import type { NextConfig } from "next";
import { storageConfig } from './src/lib/supabase-config'

const storage = storageConfig()

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  images: {
    qualities: [75, 85],
    remotePatterns: [{protocol:'https',hostname:new URL(storage.url).hostname,port:'',pathname:'/storage/v1/object/public/'+storage.bucket+'/media/**',search:''}],
    maximumRedirects: 0,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
