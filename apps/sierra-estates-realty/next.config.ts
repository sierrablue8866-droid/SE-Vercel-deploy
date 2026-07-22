import path from "node:path";
import type { NextConfig } from "next";

// Packages that use Node.js native binaries — must never be bundled client-side
const SERVER_ONLY_PACKAGES = [
  '@grpc/grpc-js',
  '@opentelemetry/exporter-trace-otlp-grpc',
  '@opentelemetry/exporter-trace-otlp-http',
  '@opentelemetry/exporter-logs-otlp-http',
  '@opentelemetry/sdk-node',
  '@opentelemetry/sdk-logs',
  '@opentelemetry/sdk-trace-node',
  '@opentelemetry/instrumentation-http',
  '@opentelemetry/instrumentation-express',
  'firebase-admin',
];


const nextConfig: NextConfig = {
  serverExternalPackages: [
    '@grpc/grpc-js',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/sdk-node',
    'firebase-admin',
  ],
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.firebasestorage.app' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/client-page/index.html' },
        { source: '/index.html', destination: '/client-page/index.html' },
      ],
      afterFiles: [
        { source: '/roi', destination: '/client-page/roi.html' },
        { source: '/compounds', destination: '/client-page/compounds.html' },
        { source: '/properties', destination: '/client-page/properties.html' },
        { source: '/property', destination: '/client-page/property.html' },
        { source: '/pricing', destination: '/client-page/pricing.html' },
        { source: '/advice', destination: '/client-page/advice.html' },
        { source: '/ai-engine', destination: '/client-page/ai-engine.html' },
        { source: '/matches', destination: '/client-page/matches.html' },
        { source: '/career', destination: '/client-page/career.html' },
        { source: '/virtual-tour', destination: '/client-page/virtual-tour.html' },
      ],
      fallback: [
        { source: '/:path*', destination: '/client-page/:path*' },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
  turbopack: {
    // Pin the monorepo root so Turbopack never infers a different checkout's
    // lockfile as the workspace root (breaks module resolution in git worktrees)
    root: path.join(__dirname, '..', '..'),
    resolveAlias: {
      '@grpc/grpc-js': './lib/stubs/empty.js',
      '@opentelemetry/exporter-trace-otlp-grpc': './lib/stubs/empty.js',
      '@opentelemetry/exporter-trace-otlp-http': './lib/stubs/empty.js',
      '@opentelemetry/exporter-logs-otlp-http': './lib/stubs/empty.js',
      '@opentelemetry/sdk-node': './lib/stubs/empty.js',
      '@opentelemetry/sdk-logs': './lib/stubs/empty.js',
      '@opentelemetry/sdk-trace-node': './lib/stubs/empty.js',
      '@opentelemetry/instrumentation-http': './lib/stubs/empty.js',
      '@opentelemetry/instrumentation-express': './lib/stubs/empty.js',
      // firebase-admin is intentionally NOT aliased here — it is a real
      // server-only package handled by serverExternalPackages above.
    }
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // Stub all server-only packages to empty modules in the browser bundle
      SERVER_ONLY_PACKAGES.forEach(pkg => {
        config.resolve.alias[pkg] = false;
      });
      config.resolve.alias['firebase-admin'] = false;
      config.resolve.alias['firebase-admin/firestore'] = false;
      config.resolve.alias['firebase-admin/storage'] = false;
    }
    return config;
  },
};

export default nextConfig;
