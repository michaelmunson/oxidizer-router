"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterError = exports.Url = exports.SearchParams = exports.getIndexRoute = exports.getStarRoute = exports.getParamRoute = void 0;
const routePrefixes = {
    star: '*',
    index: 'index',
    parameter: ':'
};
const getParamRoute = (routes) => {
    const paramRoute = Object.entries(routes).filter(([k, v]) => k.startsWith(routePrefixes.parameter))[0];
    if (paramRoute) {
        paramRoute[0] = paramRoute[0].replaceAll(':', '').replace('/', '');
        return paramRoute;
    }
    else {
        return ['/:', null];
    }
};
exports.getParamRoute = getParamRoute;
const getStarRoute = (routes) => {
    const starRoute = Object.entries(routes).filter(([k, v]) => k.startsWith(routePrefixes.star))[0];
    return starRoute ? starRoute[1] : null;
};
exports.getStarRoute = getStarRoute;
const getIndexRoute = (routes) => {
    const indexRoute = Object.entries(routes).filter(([k, v]) => k.startsWith(routePrefixes.index))[0];
    return indexRoute ? indexRoute[1] : null;
};
exports.getIndexRoute = getIndexRoute;
exports.SearchParams = {
    stringToRecord: (searchString) => {
        return Object.fromEntries(new URLSearchParams(searchString));
    },
    recordToString: (searchRecord) => {
        return new URLSearchParams(Object.entries(searchRecord)).toString();
    }
};
exports.Url = {
    get origin() {
        return window.location.origin;
    },
    get(suburl) {
        return new URL(this.origin + suburl);
    },
    getPathname(suburl) {
        const url = new URL(this.origin + suburl);
        return url.pathname;
    },
    getSubUrl(suburl) {
        const url = this.get(suburl);
        return url.href.replace(url.origin, '');
    },
    removeOrigin(url) {
        return url.href.replace(url.origin, '');
    }
};
class RouterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RouterError';
    }
}
exports.RouterError = RouterError;
