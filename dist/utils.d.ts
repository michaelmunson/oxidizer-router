import { Route, Routes, SearchRecord } from "./types";
export declare const getParamRoute: (routes: Routes) => [string, Routes | (() => HTMLElement) | undefined] | readonly ["/:", null];
export declare const getStarRoute: (routes: Routes) => Routes | (() => HTMLElement) | null | undefined;
export declare const getIndexRoute: (routes: Routes) => Routes | (() => HTMLElement) | null | undefined;
export declare const SearchParams: {
    stringToRecord: (searchString: string) => {
        [k: string]: string;
    };
    recordToString: (searchRecord: SearchRecord) => string;
};
export declare const Url: {
    readonly origin: string;
    get(suburl: string): URL;
    getPathname(suburl: string): string;
    getSubUrl(suburl: string): Route;
    removeOrigin(url: URL): Route;
};
export declare class RouterError extends Error {
    constructor(message: string);
}
