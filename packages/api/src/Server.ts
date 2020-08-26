import chalk from 'chalk'
import {ApolloServer, gql, graphqlExchange} from 'cultivar/exchanges/graphql'
import {createMiddleware, jwtMiddleware} from 'cultivar/express'
import express, {Application} from 'express'
import {readFileSync} from 'fs'
import GraphQLDateTime from 'graphql-type-datetime'
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json'
import GraphQLUUID from 'graphql-type-uuid'
import http from 'http'
import morgan from 'morgan'
import {join} from 'path'
import {createConnection} from 'typeorm'

import dbConfig from './config/Database'
import {Vars, getVars} from './config/Environment'
import ProfileResolvers from './profiles/ProfileResolvers'
import {Resolvers} from './Schema'
import UserResolvers from './users/UserResolvers'
import {getContext} from './utils/Context'

const typeDefs = gql(
  readFileSync(join(__dirname, '..', 'schema.graphql'), 'utf8')
)

const resolvers: Resolvers = {
  Query: {
    ...UserResolvers.queries(),
    ...ProfileResolvers.queries(),
  },
  Mutation: {
    ...UserResolvers.mutations(),
    ...ProfileResolvers.mutations(),
  },
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  UUID: GraphQLUUID,
}

export async function init(): Promise<Application> {
  const [
    nodeEnv = 'production',
    audience = 'production',
    issuer = 'https://storyverse.auth0.com/',
    jwksUri = 'https://storyverse.auth0.com/.well-known/jwks.json',
  ] = getVars([
    Vars.NodeEnv,
    Vars.Auth0Audience,
    Vars.Auth0Issuer,
    Vars.Auth0JwksUri,
  ])

  const isDev = nodeEnv === 'development'

  await createConnection(dbConfig)

  const app = express()
    .disable('x-powered-by')
    .use(morgan(isDev ? 'dev' : 'combined'))

  app.use(
    jwtMiddleware({
      jwt: {
        audience,
        issuer,
        algorithms: ['RS256'],
        credentialsRequired: false,
      },
      jwks: {
        jwksUri,
      },
    })
  )

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context: getContext,
    introspection: isDev,
    playground: isDev
      ? {
          settings: {
            'request.credentials': 'same-origin',
          },
        }
      : false,
    tracing: true,
    cacheControl: true,
  })
  await apollo.applyMiddleware({app})

  app.use(
    createMiddleware({
      exchange: graphqlExchange(apollo),
    })
  )

  return app
}

export function run(app: Application, port: number, baseUrl?: string): void {
  const baseUrlStr = baseUrl ? `at ${baseUrl}` : ''
  const portStr = chalk.yellow(port.toString())

  const server = http.createServer(app)

  server.listen(port, () => {
    console.log(
      chalk.cyan(`> Started Storyverse on port ${portStr}${baseUrlStr}`)
    )
  })

  server.on('close', () => {
    console.log(chalk.cyan(`> Storyverse shutting down`))
  })
}

export async function start(): Promise<void> {
  const {PORT = '3000'} = process.env

  run(await init(), Number(PORT))
}

if (require.main === module) {
  start().catch(console.error)
}
