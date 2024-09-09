"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const oxidizer_1 = require("oxidizer");
class RouterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RouterError';
    }
}
const getParamRoute = (routes) => {
    const paramRoute = Object.entries(routes).filter(([k, v]) => k.startsWith('/:'))[0];
    if (paramRoute) {
        return paramRoute;
    }
    else {
        return ['/:', null];
    }
};
const getStarRoute = (routes) => {
    const starRoute = Object.entries(routes).filter(([k, v]) => k.startsWith('/*'))[0];
    return starRoute ? starRoute[1] : null;
};
const getIndexRoute = (routes) => {
    const indexRoute = Object.entries(routes).filter(([k, v]) => k.startsWith('/%'))[0];
    return indexRoute ? indexRoute[1] : null;
};
function createRouter(routes) {
    const props = (0, oxidizer_1.createProps)({
        path: window.location.pathname
    }, [
        (0, oxidizer_1.createEffect)('path', ({ path }) => {
            window.history.pushState('page', 'title', path);
        })
    ]);
    let routeParams = {};
    const walkRoute = (route) => {
        routeParams = {};
        const routeArr = route.split('/').filter(x => x).map(r => `/${r}`);
        let currRoutes = routes;
        if (routeArr.length === 0)
            routeArr.push('/');
        for (const i in routeArr) {
            const r = routeArr[i];
            if (r in currRoutes || `${r}/` in currRoutes) {
                currRoutes = currRoutes[r];
            }
            else {
                const [param, paramRoute] = getParamRoute(currRoutes);
                if (paramRoute) {
                    currRoutes = paramRoute;
                    routeParams[param] = r;
                }
                else {
                    const starRoute = getStarRoute(currRoutes);
                    if (starRoute) {
                        currRoutes = starRoute;
                    }
                }
            }
            // break if function
            if (typeof currRoutes === "function")
                break;
        }
        if (typeof currRoutes === "function")
            return currRoutes;
        else {
            const indexRoute = getIndexRoute(currRoutes);
            if (indexRoute) {
                if (typeof indexRoute === "function")
                    return indexRoute;
                else
                    throw new RouterError('index route must be of type function');
            }
            else {
                throw new RouterError(`No routes matched current route "${route}". Consider adding a dynamic (/:), star (/*) or index (/%) route.`);
            }
        }
    };
    const RouterComponent = (0, oxidizer_1.createComponent)('oxidizer-router', class extends HTMLElement {
    });
    const Router = RouterComponent(props, $ => [
        walkRoute($.path)()
    ]);
    return [
        Router,
        {
            router: props,
            getParams: () => routeParams,
            navigate: (route) => {
                if (route.startsWith('/')) {
                    props.path = route;
                }
                else {
                    const currPath = (props.path.endsWith('/')) ? props.path.slice(0, -1) : props.path;
                    props.path = [currPath, route].join('/');
                }
            },
        }
    ];
}
