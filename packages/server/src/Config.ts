import dotenv from 'dotenv'
import Http from 'http'
import parseDbUrl from 'ts-parse-database-url'
import {GraphileUtils, GraftConfig} from '@graft/server'

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
}

export namespace Environment {
  export const isDev = process.env.NODE_ENV === 'development'
}

export namespace Graft {
  export const config: GraftConfig = {
    postgraphile: {
      appendPlugins: Plugins.plugins,
      additionalGraphQLContextFromRequest: Plugins.getGraphQLContext,
      pgSettings: Plugins.pgSettings,
      retryOnInitFail: true,
      exportJsonSchemaPath: Environment.isDev
        ? `${__dirname}/../../../schema.json`
        : undefined,
    },
    jwt: {
      audience: Auth.audience,
      issuer: Auth.issuer,
      algorithms: ['RS256'],
      credentialsRequired: false,
    },
    jwks: {
      jwksUri: Auth.jwksUri,
    },
    database: {
      url: Database.url,
    },
  }
}

export default {Auth, Database, Server, Graft, Environment}
