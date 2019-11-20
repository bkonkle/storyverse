import {createClient, dedupExchange, fetchExchange} from 'urql'
import {cacheExchange} from '@urql/exchange-graphcache'
import fetch from 'isomorphic-fetch'

import schema from '../../../../schema.json'
import {tokens} from '../data/AuthClient'

export const client = createClient({
  url:
    process.env.GATSBY_API_URL ||
    'https://storyverse-prod-api.konkle.us/graphql',
  fetch,
  fetchOptions: () => {
    if (tokens.accessToken) {
      return {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    }

    return {}
  },
  exchanges: [
    dedupExchange,
    cacheExchange({schema: schema.data}),
    fetchExchange,
  ],
})
