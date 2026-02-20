/**
 * Next.js config wrapper that adds the designtools source annotation loader.
 *
 * Usage:
 *   import { withDesigntools } from "@designtools/next-plugin";
 *   export default withDesigntools({ ...yourConfig });
 */
declare function withDesigntools<T extends Record<string, any>>(nextConfig?: T): T;

export { withDesigntools };
