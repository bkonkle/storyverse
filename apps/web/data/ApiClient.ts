import {cacheExchange} from '@urql/exchange-graphcache'
import {IntrospectionQuery} from 'graphql'
import {NextApiRequest, NextApiResponse} from 'next'
import {dedupExchange, fetchExchange} from 'urql'
import {NextUrqlContext, SSRExchange} from 'next-urql'

import schema from '../../../schema.json'

const {
  NEXT_PUBLIC_API_URL = 'https://storyverse-prod-api.konkle.us/graphql',
} = process.env

export const getAccessToken = (
  req: NextApiRequest,
  res: NextApiResponse
): string | undefined => {
  // Only require the AuthClient on the server
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const AuthClient = require('./AuthClient')

  const auth0 = AuthClient.init()
  const session = auth0.getSession(req, res)

  if (!session) {
    return
  }

  return session.idToken
}

export const api = (ssrExchange: SSRExchange, ctx?: NextUrqlContext) => {
  return {
    url: NEXT_PUBLIC_API_URL,
    fetchOptions: () => {
      // If we're on the server, add the Authorization header
      if (ctx?.req && ctx?.res) {
        const accessToken = getAccessToken(ctx.req, ctx.res)

        if (accessToken) {
          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
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
