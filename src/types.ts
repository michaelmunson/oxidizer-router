export type Route = `/${string}` | `/*` | `/%`;
export type Routes = {
   [key: Route]: (
      Routes | (() => HTMLElement)
   )
}
export type Search = `?${string}`
export type SearchRecord = Record<string,string>

export type RouterProps = {
    path: Route
}