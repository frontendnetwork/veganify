const million = require("million/compiler");

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

const millionConfig = {
  auto: { rsc: true },
};

nextConfig = million.next(nextConfig, millionConfig);

module.exports = nextConfig;
