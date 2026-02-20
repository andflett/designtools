/**
 * Webpack loader that adds data-source="file:line:col" attributes to JSX elements.
 * Uses Babel's parser for correct JSX identification (avoids matching TypeScript generics).
 * SWC stays enabled as the primary compiler — Babel is only used here for the source annotation pass.
 */
interface LoaderContext {
    resourcePath: string;
    rootContext: string;
    getOptions(): {
        cwd?: string;
    };
    callback(err: Error | null, content?: string, sourceMap?: any): void;
    async(): (err: Error | null, content?: string, sourceMap?: any) => void;
}
declare function designtoolsLoader(this: LoaderContext, source: string): void;

export { designtoolsLoader as default };
