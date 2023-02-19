const withPWA = require('next-pwa')({
  dest: 'public',
  swSrc: 'service-worker.js'
})

/** @type {import('next').NextConfig} */

module.exports = withPWA({
  reactStrictMode: true,
  i18n: {
    locales: ['de', 'en', 'fr', 'es'],
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