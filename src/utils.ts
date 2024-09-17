import { Route, Routes, SearchRecord } from "./types";

const routePrefixes = {
    star: '*',
    index: 'index',
    parameter: ':'
}

export const getParamRoute = (routes: Routes) => {
    const paramRoute = Object.entries(routes).filter(([k, v]) => k.startsWith(routePrefixes.parameter))[0];
    if (paramRoute) {
        paramRoute[0] = paramRoute[0].replaceAll(':','').replace('/','');
        return paramRoute;
    } else {
        return <const>['/:', null];
    }
};
export const getStarRoute = (routes: Routes) => {
    const starRoute = Object.entries(routes).filter(([k, v]) => k.startsWith(routePrefixes.star))[0];
    return starRoute ? starRoute[1] : null;
};
export const getIndexRoute = (routes: Routes) => {
    const indexRoute = Object.entries(routes).filter(([k, v]) => k.startsWith(routePrefixes.index))[0];
    return indexRoute ? indexRoute[1] : null;
};

export const SearchParams = {
    stringToRecord: (searchString:string) => {
        return Object.fromEntries(new URLSearchParams(searchString))
    },
    recordToString: (searchRecord:SearchRecord) => {
        return new URLSearchParams(Object.entries(searchRecord)).toString();
    }
}

export const Url = {
    get origin(){
        return window.location.origin;
    },
    get(suburl:string){
        return new URL(this.origin + suburl);
    },
    getPathname(suburl:string){
        const url = new URL(this.origin + suburl);
        return url.pathname;
    },
    getSubUrl(suburl:string){
        const url = this.get(suburl);
        return url.href.replace(url.origin, '') as Route;
    }
}


export class RouterError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RouterError'
    }
}
