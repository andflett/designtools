/**
 * Next.js config wrapper that adds the designtools source annotation loader.
 *
 * Usage:
 *   import { withDesigntools } from "@designtools/next-plugin";
 *   export default withDesigntools({ ...yourConfig });
 */

import path from "path";

export function withDesigntools<T extends Record<string, any>>(nextConfig: T = {} as T): T {
  return {
    ...nextConfig,
    webpack(config: any, context: any) {
      // Only add the loader in development
      if (context.dev) {
        config.module.rules.push({
          test: /\.(tsx|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: path.resolve(__dirname, "loader.js"),
              options: {
                cwd: context.dir,
              },
            },
          ],
        });
      }

      // Call the user's webpack config if provided
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
  };
}
