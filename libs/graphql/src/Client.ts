import {cacheExchange} from '@urql/exchange-graphcache'
import {IntrospectionData} from '@urql/exchange-graphcache/dist/types/ast'
import {dedupExchange, fetchExchange} from 'urql'
import {NextUrqlClientConfig} from 'next-urql'

import schema from '../../../schema.json'

export const getConfig: NextUrqlClientConfig = (ssrExchange, _ctx) => ({
  url: '/api/graphql',
  exchanges: [
    dedupExchange,
    cacheExchange({schema: schema as IntrospectionData}),
    ssrExchange,
    fetchExchange,
  ],
})
