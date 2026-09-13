import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        destination: "/privacy-policy",
        source: "/datenschutz",
      },
    ];
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default withNextIntl(nextConfig);
