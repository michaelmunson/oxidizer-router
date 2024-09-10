import { createProps, createEffect, createComponent } from "oxidizer";
import { Route, RouterProps, Routes, Search, SearchRecord } from "./types";
import { RouterError, getIndexRoute, getParamRoute, getStarRoute, Url, SearchParams } from "./utils";

export function createRouter<T extends Routes>(routes: T) {
   const props = createProps<RouterProps>({
      path: window.location.pathname as Route,
   }, [
      createEffect('path', ({ path }) => {
         window.history.pushState('page', 'title', path);
      }),
   ]);

   let routeParams:Record<string,string> = {};

   const walkRoute = (route:string) => {
      routeParams = {};
      
      const routeArr:Route[] = route.split('/').filter(x => x).map(r => `/${r}` as Route);
      
      let currRoutes:Routes[Route] = routes;
      
      if (routeArr.length === 0) routeArr.push('/')
      
      for (const i in routeArr){
         const r = routeArr[i];
         if (r in currRoutes || `${r}/` in currRoutes){
            currRoutes = currRoutes[r];
         }
         else {
            const [param, paramRoute] = getParamRoute(currRoutes);
            if (paramRoute){
               currRoutes = paramRoute;
               routeParams[param] = r;
            }
            else {
               const starRoute = getStarRoute(currRoutes);
               if (starRoute){
                  currRoutes = starRoute;
               }
            }
         }
         // break if function
         if (typeof currRoutes === "function") break;
      }
      if (typeof currRoutes === "function") return currRoutes;
      else {
         const indexRoute = getIndexRoute(currRoutes);
         if (indexRoute){
            if (typeof indexRoute === "function") return indexRoute;
            else throw new RouterError('index route must be of type function')
         } else {
            throw new RouterError(`No routes matched current route "${route}". Consider adding a dynamic (/:), star (/*) or index (/%) route.`)
         }
      }
   }

   const RouterComponent = createComponent(
      'oxidizer-router',
      class extends HTMLElement {}
   );
   
   const Router = RouterComponent(props, $ => [
      walkRoute($.path)()
   ]);
   
   return <const>[
      Router,
      {
         router: props,
         getParams: () => routeParams,
         getSearch: () => SearchParams.stringToRecord(window.location.search),
         getPathname: () => Url.getPathname(props.path),
         setSearch: (search:SearchRecord|string) => {
            const searchString = typeof search === "string" ? search : SearchParams.recordToString(search);
            const url = Url.get(props.path);
            url.search = searchString;
            props.path = url.href.replace(url.origin, '') as Route;
         },
         navigate: (route: Route, search?:SearchRecord) => {
            const url = Url.get(route);
            if (search){
               url.search = SearchParams.recordToString(search);
            }
            props.path = url.href.replace(url.origin, '') as Route;
         },
         
      }
   ]
}
