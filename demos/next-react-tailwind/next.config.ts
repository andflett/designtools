import type { NextConfig } from "next";
import { withDesigntools } from "../../packages/next-plugin/dist/index.mjs";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
};

export default withDesigntools(nextConfig);
