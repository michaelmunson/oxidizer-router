import { createProps, createEffect, createComponent, DIV } from "oxidizer";
import { Route, RouterProps, Routes, Search, SearchRecord } from "./types";
import { RouterError, getIndexRoute, getParamRoute, getStarRoute, Url, SearchParams } from "./utils";


const props = createProps<RouterProps>({
    path: window.location.pathname as Route,
}, [
    createEffect('path', ({ path }) => {
        try {
            window.history.pushState('page', 'title', path);
        } catch (e) {
            throw new RouterError(`Failed to navigate path "${path}"`)
        }
    }),
]);


let routeParams: Record<string, string> = {};

const walkRoute = (routes: Routes, route: string) => {
    route = Url.getPathname(route);

    routeParams = {};

    const routeArr: Route[] = route.split('/').filter(x => x).map(r => `/${r}` as Route);

    let currRoutes: Routes[Route] = routes;

    if (routeArr.length === 0) routeArr.push('/');

    for (const i in routeArr) {
        if (!currRoutes){
            throw new RouterError('Router object must not be null or undefined');
        }
        const r = routeArr[i];
        if (r in currRoutes || `${r}/` in currRoutes) {
            currRoutes = currRoutes[r];
        }
        else {
            const [param, paramRoute] = getParamRoute(currRoutes);
            if (paramRoute) {
                currRoutes = paramRoute;
                routeParams[param] = r.replace('/','');
            }
            else {
                const starRoute = getStarRoute(currRoutes);
                if (starRoute) {
                    currRoutes = starRoute;
                }
            }
        }
        // break if function
        if (typeof currRoutes === "function") break;
    }
    if (typeof currRoutes === "function") return currRoutes;
    else if (!currRoutes) throw new RouterError('Router object must not be null or undefined');
    else {
        const indexRoute = getIndexRoute(currRoutes);
        if (indexRoute) {
            if (typeof indexRoute === "function") return indexRoute;
            else throw new RouterError('index route must be of type function')
        } else {
            throw new RouterError(`No routes matched current route "${route}". Consider adding a dynamic (/:), star (/*) or index (/%) route.`)
        }
    }
}

const RouterComponent = createComponent(
    'oxidizer-router',
    class extends HTMLElement { }
);

export const getParams = () => routeParams;
export const getSearch = () => SearchParams.stringToRecord(window.location.search);
export const getHash = () => window.location.hash.replace('#','');
export const getPathname = () => Url.getPathname(props.path);
export const setSearch = (search: SearchRecord | string) => {
    const searchString = typeof search === "string" ? search : SearchParams.recordToString(search);
    const url = Url.get(props.path);
    url.search = searchString;
    props.path = Url.removeOrigin(url);
}
export const setHash = (hash:string) => {
    const url = Url.get(props.path);
    url.hash = hash;
    props.path = Url.removeOrigin(url);
}


export const navigate = (route: string, {hash, search}:{search?: SearchRecord | string, hash?: string}={}) => {
    if (!route.startsWith('/')){
        route = props.path + '/' + route as Route;
    }
    const url = Url.get(route);
    if (search) {
        url.search = typeof search === "string" ? search : SearchParams.recordToString(search);
    }
    if (hash) {
        url.hash = hash;
    }
    props.path = Url.removeOrigin(url);
}

export default function Router<T extends Routes>(routes: T) {
    return RouterComponent(props, $ => [
        walkRoute(routes, $.path)()
    ]);
}
