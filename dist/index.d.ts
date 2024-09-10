import { Route, RouterProps, Routes, SearchRecord } from "./types";
export declare function createRouter<T extends Routes>(routes: T): readonly [HTMLElement, {
    readonly router: RouterProps;
    readonly getParams: () => Record<string, string>;
    readonly getSearch: () => {
        [k: string]: string;
    };
    readonly getPathname: () => string;
    readonly setSearch: (search: SearchRecord | string) => void;
    readonly navigate: (route: Route, search?: SearchRecord) => void;
}];
