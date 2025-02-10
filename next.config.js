/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    appDir: true,
    staticPageGenerationTimeout: 1000,
  },
  trailingSlash: true,
  generateStaticParams: async () => {
    return {
      '/egitim/zindandan-kacis': {
        dynamic: 'force-static',
      },
    };
  },
};

module.exports = nextConfig;
