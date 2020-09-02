import {InitOptions, start} from 'cultivar/express'
import {gql} from 'cultivar/graphql'
import {readFileSync} from 'fs'
import GraphQLDateTime from 'graphql-type-datetime'
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json'
import GraphQLUUID from 'graphql-type-uuid'
import {join} from 'path'

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

export const getOptions = (env = process.env): InitOptions => {
  const [
    nodeEnv = 'production',
    audience = 'production',
    issuer = 'https://storyverse.auth0.com/',
    jwksUri = 'https://storyverse.auth0.com/.well-known/jwks.json',
  ] = getVars(
    [Vars.NodeEnv, Vars.Auth0Audience, Vars.Auth0Issuer, Vars.Auth0JwksUri],
    env
  )

  return {
    label: 'Storyverse',
    nodeEnv,
    db: {
      config: dbConfig,
    },
    auth: {
      config: {
        jwt: {
          audience,
          issuer,
          credentialsRequired: false,
        },
        jwks: {
          jwksUri,
        },
      },
    },
    apollo: {
      config: {
        typeDefs,
        resolvers,
        context: getContext,
      },
    },
  }
}

export const run = async () => start(getOptions())

if (require.main === module) {
  run().catch(console.error)
}
