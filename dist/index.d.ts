import { Route, Routes, SearchRecord } from "./types";
export { type Route, type Routes };
export declare const getParams: () => Record<string, string>;
export declare const getSearch: () => {
    [k: string]: string;
};
export declare const getHash: () => string;
export declare const getPathname: () => string;
export declare const setSearch: (search: SearchRecord | string) => void;
export declare const setHash: (hash: string) => void;
export declare const navigate: (route: string, { hash, search }?: {
    search?: SearchRecord | string;
    hash?: string;
}) => void;
export default function Router<T extends Routes>(routes: T): HTMLElement;
