"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouter = createRouter;
const oxidizer_1 = require("oxidizer");
const utils_1 = require("./utils");
function createRouter(routes) {
    const props = (0, oxidizer_1.createProps)({
        path: window.location.pathname,
    }, [
        (0, oxidizer_1.createEffect)('path', ({ path }) => {
            window.history.pushState('page', 'title', path);
        }),
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
                const [param, paramRoute] = (0, utils_1.getParamRoute)(currRoutes);
                if (paramRoute) {
                    currRoutes = paramRoute;
                    routeParams[param] = r;
                }
                else {
                    const starRoute = (0, utils_1.getStarRoute)(currRoutes);
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
            const indexRoute = (0, utils_1.getIndexRoute)(currRoutes);
            if (indexRoute) {
                if (typeof indexRoute === "function")
                    return indexRoute;
                else
                    throw new utils_1.RouterError('index route must be of type function');
            }
            else {
                throw new utils_1.RouterError(`No routes matched current route "${route}". Consider adding a dynamic (/:), star (/*) or index (/%) route.`);
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
            getSearch: () => utils_1.SearchParams.stringToRecord(window.location.search),
            getPathname: () => utils_1.Url.getPathname(props.path),
            setSearch: (search) => {
                const searchString = typeof search === "string" ? search : utils_1.SearchParams.recordToString(search);
                const url = utils_1.Url.get(props.path);
                url.search = searchString;
                props.path = url.href.replace(url.origin, '');
            },
            navigate: (route, search) => {
                const url = utils_1.Url.get(route);
                if (search) {
                    url.search = utils_1.SearchParams.recordToString(search);
                }
                props.path = url.href.replace(url.origin, '');
            },
        }
    ];
}
