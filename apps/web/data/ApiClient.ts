import {cacheExchange} from '@urql/exchange-graphcache'
import {IntrospectionQuery} from 'graphql'
import {dedupExchange, fetchExchange} from 'urql'
import {NextUrqlContext, SSRExchange} from 'next-urql'

import schema from '../../../schema.json'

export const api = (ssrExchange: SSRExchange, _ctx?: NextUrqlContext) => {
  const {BASE_URL} = process.env
  const url = `${BASE_URL}/api/graphql`
  console.log(`>- url ->`, url)

  return {
    url,
    exchanges: [
      dedupExchange,
      cacheExchange({schema: (schema as unknown) as IntrospectionQuery}),
      ssrExchange,
      fetchExchange,
    ],
  }
}
