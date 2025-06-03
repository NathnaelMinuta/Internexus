/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Internexus',
  assetPrefix: '/Internexus/',
  trailingSlash: true,
}

module.exports = nextConfig 