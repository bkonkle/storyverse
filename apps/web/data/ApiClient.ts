import {createClient, dedupExchange, fetchExchange} from 'urql'
import {cacheExchange} from '@urql/exchange-graphcache'
import fetch from 'isomorphic-fetch'
import {IntrospectionQuery} from 'graphql'

import schema from '../schema.json'

const {
  NEXT_PUBLIC_API_URL = 'https://storyverse-prod-api.konkle.us/graphql',
} = process.env

export const getAccessToken = (): string | undefined => {
  return
}

export const client = createClient({
  url: NEXT_PUBLIC_API_URL,
  fetch,
  fetchOptions: () => {
    const accessToken = getAccessToken()

    if (accessToken) {
      return {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    }

    return {}
  },
  exchanges: [
    dedupExchange,
    cacheExchange({schema: (schema as unknown) as IntrospectionQuery}),
    fetchExchange,
  ],
})
