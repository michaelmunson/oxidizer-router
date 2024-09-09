type Route = `/${string}` | `/*` | `/%`;
type Routes = {
    [key: Route]: (Routes | (() => HTMLElement));
};
export declare function createRouter<T extends Routes>(routes: T): readonly [HTMLElement, {
    readonly router: {
        path: string;
    };
    readonly getParams: () => Record<string, string>;
    readonly navigate: (route: string) => void;
}];
export {};
