export type Route = (
/**@description basic route */
`/${string}` | 
/**@description catch all route */
`*` | 
/**@description index route */
`index` | 
/**@description parameter route */
`:`);
export type Routes = {
    [K in Route]: (Routes | (() => HTMLElement));
};
export type Search = `?${string}`;
export type SearchRecord = Record<string, string>;
export type RouterProps = {
    path: Route;
};
