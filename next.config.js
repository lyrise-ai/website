const path = require('path')

module.exports = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: '/dashboard', destination: 'https://roi.lyrise.ai/dashboard', permanent: false },
      { source: '/roi-report', destination: 'https://roi.lyrise.ai/roi-report', permanent: false },
      { source: '/roi-report/:path*', destination: 'https://roi.lyrise.ai/roi-report/:path*', permanent: false },
      { source: '/report/:id', destination: 'https://roi.lyrise.ai/report/:id', permanent: false },
      { source: '/roi-feedback', destination: 'https://roi.lyrise.ai/roi-feedback', permanent: false },
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@services': path.resolve(__dirname, 'src/services'),
      // ROI pipeline uses @/ as project root alias
      '@': path.resolve(__dirname),
    }
    return config
  },
}
