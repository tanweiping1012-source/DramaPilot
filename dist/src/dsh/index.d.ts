export declare const name = "dramapilot";
export declare const inject: string[];
export declare const DSH_BASELINE: {
    version: string;
    commit: string;
};
type Context = {
    tools: {
        register: (tool: unknown) => unknown;
    };
    effect?: (fn: () => () => void) => unknown;
};
export declare function apply(ctx: Context, config?: {
    runtimeDir?: string;
    fixtureDir?: string;
    workspaceRoot?: string;
}): Promise<void>;
export {};
