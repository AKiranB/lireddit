import { QueryInput, Cache } from '@urql/exchange-graphcache';

// interface Cache {
//   updateQuery: any;
// }
export function betterUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query) {
    return cache.updateQuery(qi, (data: any) => fn(result, data as any) as any);
}
