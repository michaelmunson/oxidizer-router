import { Route, Routes, SearchRecord } from "./types";
export declare const getParams: () => Record<string, string>;
export declare const getSearch: () => {
    [k: string]: string;
};
export declare const getPathname: () => string;
export declare const setSearch: (search: SearchRecord | string) => void;
export declare const navigate: (route: Route, search?: SearchRecord) => void;
export default function Router<T extends Routes>(routes: T): HTMLElement;
