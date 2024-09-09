import { createProps, createEffect, createComponent } from "oxidizer";

type Route = `/${string}` | `/*` | `/%`;

type Routes = {
   [key: Route]: (
      Routes | (() => HTMLElement)
   )
}

class RouterError extends Error {
   constructor(message:string){
      super(message);
      this.name = 'RouterError'
   }
}

const getParamRoute = (routes:Routes) => {
   const paramRoute = Object.entries(routes).filter(([k,v]) => k.startsWith('/:'))[0];
   if (paramRoute){
      return paramRoute;
   } else {
      return <const>['/:', null];
   }
};
const getStarRoute = (routes:Routes) => {
   const starRoute = Object.entries(routes).filter(([k,v]) => k.startsWith('/*'))[0];
   return starRoute ? starRoute[1] : null;
}
const getIndexRoute = (routes:Routes) => {
   const indexRoute = Object.entries(routes).filter(([k,v]) => k.startsWith('/%'))[0];
   return indexRoute ? indexRoute[1] : null;
}


export function createRouter<T extends Routes>(routes: T) {
   const props = createProps({
      path: window.location.pathname
   }, [
      createEffect('path', ({ path }) => {
         window.history.pushState('page', 'title', path);
      })
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
         navigate: (route: string) => {
            if (route.startsWith('/')) {
               props.path = route;
            } else {
               const currPath = (props.path.endsWith('/')) ? props.path.slice(0, -1) : props.path;
               props.path = [currPath, route].join('/');
            }
         },
      }
   ]
}
