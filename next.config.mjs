/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
    ignoreDuringBuilds: true, // 👈 ESLint warnings/errors ko ignore karega build time pe
  },
};

export default nextConfig;
