import {cacheExchange} from '@urql/exchange-graphcache'
import {IntrospectionQuery} from 'graphql'
import {dedupExchange, fetchExchange} from 'urql'
import {NextUrqlContext, SSRExchange} from 'next-urql'

import schema from '../../../../schema.json'

export const api = (ssrExchange: SSRExchange, _ctx?: NextUrqlContext) => {
  return {
    url: '/api/graphql',
    exchanges: [
      dedupExchange,
      cacheExchange({schema: (schema as unknown) as IntrospectionQuery}),
      ssrExchange,
      fetchExchange,
    ],
  }
}
