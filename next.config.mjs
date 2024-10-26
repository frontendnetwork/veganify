import million from 'million/compiler';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
let nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  async rewrites() {
    return [
      {
        source: "/datenschutz",
        destination: "/privacy-policy",
      }
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