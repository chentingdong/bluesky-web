/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    "ag-grid-enterprise",
    "ag-grid-community",
    "ag-grid-react",
  ],
}

module.exports = nextConfig
