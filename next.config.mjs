/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['example.com'], // Add your image domains here
    formats: ['image/avif', 'image/webp'], // ✅ Enable AVIF and WebP
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // // Add this section to handle the OneSignal service worker
  // async headers() {
  //   return [
  //     {
  //       source: '/OneSignalSDKWorker.js',
  //       headers: [
  //         {
  //           key: 'Service-Worker-Allowed',
  //           value: '/',
  //         },
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=0, must-revalidate',
  //         },
  //         {
  //           key: 'Content-Type',
  //           value: 'application/javascript',
  //         }
  //       ],
  //     },
  //     {
  //       source: '/sw.js',
  //       headers: [
  //         {
  //           key: 'Service-Worker-Allowed',
  //           value: '/',
  //         },
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=0, must-revalidate',
  //         },
  //         {
  //           key: 'Content-Type',
  //           value: 'application/javascript',
  //         }
  //       ],
  //     },
  //   ];
  // },
}

export default nextConfig

