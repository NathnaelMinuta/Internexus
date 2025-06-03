/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Internexus',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig 