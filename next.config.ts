import type { NextConfig } from "next";
import "./src/lib/env/clientEnv";
import "./src/lib/env/serverEnv";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },

  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
