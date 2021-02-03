import {readFileSync} from 'fs'
import GraphQLDateTime from 'graphql-type-datetime'
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json'
import GraphQLUUID from 'graphql-type-uuid'
import gql from 'graphql-tag'
import {merge} from 'lodash'
import {join} from 'path'
import {ApolloServer} from 'apollo-server-express'
import express, {Application} from 'express'
import morgan from 'morgan'

import {jwtMiddleware} from './authentication/JwtMiddleware'

import {Vars, getVars} from './config/Environment'
import {Resolvers} from './Schema'
import UserResolvers from './users/UserResolvers'
import ProfileResolvers from './profiles/ProfileResolvers'
import UniverseResolvers from './universes/UniverseResolvers'
import SeriesResolvers from './series/SeriesResolvers'
import StoryResolvers from './stories/StoryResolvers'
import {getContext} from './utils/Context'

const typeDefs = gql(
  readFileSync(join(__dirname, '..', 'schema.graphql'), 'utf8')
)

export const getResolvers = (): Resolvers => {
  const users = new UserResolvers()
  const profiles = new ProfileResolvers()
  const universes = new UniverseResolvers()
  const series = new SeriesResolvers()
  const stories = new StoryResolvers()

  return merge(
    {
      DateTime: GraphQLDateTime,
      JSON: GraphQLJSON,
      JSONObject: GraphQLJSONObject,
      UUID: GraphQLUUID,
    },
    users.getResolvers(),
    profiles.getResolvers(),
    universes.getResolvers(),
    series.getResolvers(),
    stories.getResolvers()
  )
}

export async function init(
  resolvers: Resolvers = getResolvers(),
  env = process.env
): Promise<Application> {
  const [
    nodeEnv = 'production',
    audience = 'production',
    issuer = 'https://storyverse.auth0.com/',
  ] = getVars([Vars.NodeEnv, Vars.OAuth2Audience, Vars.OAuth2Issuer], env)

  const isDev = nodeEnv === 'development'

  const app = express()
    .disable('x-powered-by')
    .use(morgan(isDev ? 'dev' : 'combined'))

  app.use(
    jwtMiddleware({
      jwt: {
        audience,
        issuer,
        credentialsRequired: false,
      },
      jwks: {
        jwksUri: `${issuer}.well-known/jwks.json`,
      },
    })
  )

  const apollo = new ApolloServer({
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
    typeDefs,
    resolvers,
    context: getContext,
  })
  apollo.applyMiddleware({app})

  return app
}

export default {init}
