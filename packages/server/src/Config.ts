import dotenv from 'dotenv'
import Http from 'http'
import jwks from 'jwks-rsa'
import parseDbUrl from 'ts-parse-database-url'
import {GraphileUtils, PostGraphileOptions} from '@graft/server'
import {MiddlewareOptions} from 'graphql-playground-html'

import Plugins from './Plugins'

export interface User {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
}

export interface IncomingMessage extends Http.IncomingMessage {
  user?: User
}

export interface Context extends GraphileUtils.PostGraphileContext {
  user?: User
}

export type AppRequest = GraphileUtils.GraphileRequest<Context>

dotenv.config()

export namespace Auth {
  export const jwksUri =
    process.env.AUTH0_JWKS_URI ||
    'https://storyverse.auth0.com/.well-known/jwks.json'
  export const audience =
    process.env.AUTH0_AUDIENCE || 'https://storyverse.konkle.us'
  export const issuer =
    process.env.AUTH0_ISSUER || 'https://storyverse.auth0.com/'
}

export namespace Database {
  const _url =
    process.env.DATABASE_URL ||
    'postgres://storyverse_root:password@localhost:5432/storyverse'

  const _config = parseDbUrl(_url)

  export const user = process.env.DATABASE_USERNAME || _config.user
  export const password = process.env.DATABASE_PASSWORD || _config.password
  export const host = process.env.DATABASE_HOSTNAME || _config.host
  export const port = Number(process.env.DATABASE_PORT || _config.port)
  export const database = process.env.DATABASE_NAME || _config.database

  export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0')
  export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
  export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000')

  export const url = `postgres://${user}:${password}@${host}:${port}/${database}`
}

export namespace Server {
  export const port = Number(process.env.PORT || '4000')
  export const bodyLimit = '100kb'
  export const corsHeaders = ['Link']
}

export namespace PostGraphile {
  export const jwt = {
    // @ts-ignore jwks-rsa types are inaccurate - it returns a SecretLoader
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: Auth.jwksUri,
    }),
    audience: Auth.audience,
    issuer: Auth.issuer,
    algorithms: ['RS256'],
    credentialsRequired: false,
  }

  export const playground: MiddlewareOptions = {
    endpoint: '/graphql',
    settings: {
      // @ts-ignore - incomplete type
      'schema.polling.enable': false,
    },
  }

  export const config: PostGraphileOptions = {
    appendPlugins: Plugins.plugins,
    additionalGraphQLContextFromRequest: Plugins.getGraphQLContext,
    pgSettings: Plugins.pgSettings,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    retryOnInitFail: true,
  }
}

export namespace Environment {
  export const isDev = process.env.NODE_ENV === 'development'
}

export default {Auth, Database, Server, PostGraphile, Environment}
