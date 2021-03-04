import {cacheExchange} from '@urql/exchange-graphcache'
import {IntrospectionQuery} from 'graphql'
import {NextApiRequest} from 'next'
import {dedupExchange, fetchExchange} from 'urql'
import {NextUrqlContext, SSRExchange} from 'next-urql'
import Cookie from 'js-cookie'

import schema from '../schema.json'

const {
  NEXT_PUBLIC_API_URL = 'https://storyverse-prod-api.konkle.us/graphql',
} = process.env

export const getAccessToken = (req?: NextApiRequest): string | undefined => {
  if (req) {
    console.log(`>- req.cookie ->`, req.headers.cookie)

    return
  }

  return Cookie.get('appSession')
}

export const api = (ssrExchange: SSRExchange, ctx?: NextUrqlContext) => {
  return {
    url: NEXT_PUBLIC_API_URL,
    fetchOptions: () => {
      const accessToken = getAccessToken(ctx?.req)

      console.log(`>- Authorization ->`, `Bearer ${accessToken}`)

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
      ssrExchange,
      fetchExchange,
    ],
  }
}
