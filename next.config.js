const path = require('path')

module.exports = {
  reactStrictMode: false,
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
