import million from "million/compiler";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const baseConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
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

// Apply Million's optimization
// eslint-disable-next-line import/no-named-as-default-member
const nextConfig: NextConfig = million.next(baseConfig, millionConfig);

// Apply next-intl plugin and export the final config
export default withNextIntl(nextConfig);
