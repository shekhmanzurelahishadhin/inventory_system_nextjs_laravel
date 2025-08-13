import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['images.unsplash.com', 'example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables that should be exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true, // If you're using styled-components
  },
  
  // Enable SWC minification (default in Next.js 13+)
  swcMinify: true,
  
  // You can add custom webpack configuration if needed
  webpack: (config, { isServer }) => {
    // Custom webpack config here
    return config;
  },
};

export default nextConfig;