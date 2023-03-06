const withPWA = require('next-pwa')({
  dest: 'public',
  swSrc: 'service-worker.js'
})

/** @type {import('next').NextConfig} */

module.exports = withPWA({
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ['de', 'en', 'fr', 'es', 'uwu'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/datenschutz',
        destination: '/privacy-policy',
      },
    ]
  }
});