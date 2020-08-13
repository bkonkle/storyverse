import chalk from 'chalk'
import express, {Application} from 'express'
import http from 'http'
import morgan from 'morgan'
import {readFileSync} from 'fs'
import {join} from 'path'
import GraphQLDateTime from 'graphql-type-datetime'
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json'
import GraphQLUUID from 'graphql-type-uuid'
import {ApolloServer, gql} from 'cultivar/exchanges/graphql'

import * as App from './App'
import {Resolvers} from './Schema'
import ProfileResolvers from './profiles/ProfileResolvers'
import {getContext} from './utils/Context'

const typeDefs = gql(
  readFileSync(join(__dirname, '..', 'schema.graphql'), 'utf8')
)

const resolvers: Resolvers = {
  Query: {
    ...ProfileResolvers.Queries,
  },
  Mutation: {
    ...ProfileResolvers.Mutations,
  },
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  UUID: GraphQLUUID,
}

export async function start(): Promise<void> {
  const {NODE_ENV = 'production'} = process.env

  const isDev = NODE_ENV === 'development'

  const app = express()
    .disable('x-powered-by')
    .use(morgan(isDev ? 'dev' : 'combined'))

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

  app.use(App.middleware(apollo))

  run(app, 3000)
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

if (require.main === module) {
  start().catch(console.error)
}
