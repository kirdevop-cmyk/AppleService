/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Гарантуємо, що markdown-файли бази знань потраплять у serverless-функцію
  // (їх читає lib/knowledge-base.ts через fs у рантаймі /api/chat).
  outputFileTracingIncludes: {
    '/api/chat': ['./content/kb/**/*'],
  },
};

export default nextConfig;
