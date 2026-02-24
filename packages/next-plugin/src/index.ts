/**
 * Next.js config wrapper that adds the designtools source annotation loader
 * and auto-mounts the <CodeSurface /> selection component in development.
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

        // Add a loader for root layout files that auto-mounts <CodeSurface />
        config.module.rules.push({
          test: /layout\.(tsx|jsx)$/,
          include: [
            path.resolve(context.dir, "app"),
            path.resolve(context.dir, "src/app"),
          ],
          use: [
            {
              loader: path.resolve(__dirname, "codesurface-mount-loader.js"),
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
