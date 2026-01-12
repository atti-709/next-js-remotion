/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  transpilePackages: ['remotion', '@remotion/player', '@getmoments/remotion-rendering'],
};

module.exports = nextConfig;
