import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        // Бэкенд на Render (https://*.onrender.com)
        protocol: "https",
        hostname: "*.onrender.com",
        pathname: "/uploads/**",
      },
      {
        // Фото товаров с Unsplash
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Загруженные картинки в Cloudinary
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
