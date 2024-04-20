const next = require('next');

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  i18n: {
    locales: ["de", "en", "fr", "es", "pl", "cz"],
    defaultLocale: "en",
  },
  async rewrites() {
    return [
      {
        source: "/datenschutz",
        destination: "/privacy-policy",
      },
    ];
  },
};

module.exports = nextConfig;