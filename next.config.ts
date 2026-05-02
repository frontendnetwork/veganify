import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  turbopack: {
    root: import.meta.dirname,
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

export default withNextIntl(nextConfig);
