import million from 'million/compiler';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: "/datenschutz",
        destination: "/privacy-policy",
      },
      {
        source: "/impressum",
        destination: "/en/impressum",
      },
    ];
  },
};

const millionConfig = {
  auto: { rsc: true },
};

// Apply Million's optimization
nextConfig = million.next(nextConfig, millionConfig);

// Apply next-intl plugin
export default withNextIntl(nextConfig);