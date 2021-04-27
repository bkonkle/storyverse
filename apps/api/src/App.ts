import 'reflect-metadata'
import * as fs from 'fs'
import GraphQLJSON, {GraphQLJSONObject} from 'graphql-type-json'
import gql from 'graphql-tag'
import {merge} from 'lodash'
import {join} from 'path'
import {ApolloServer} from 'apollo-server-express'
import express, {Application} from 'express'
import morgan from 'morgan'
import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import {DocumentNode} from 'graphql'
import {container, injectable, inject, injectAll} from 'tsyringe'

import {Schema} from '@storyverse/graphql/api'

import {Vars, getVars} from './config/Environment'
import {Context, getContext} from './utils/Context'
import {Resolvers, GraphQLResolvers} from './utils/GraphQL'
import GraphQLDateTime from './utils/GraphQLDateTime'
import {ProcessEnv, NodeFS} from './utils/Injection'
import AppRegistry from './AppRegistry'

@injectable()
export default class App {
  private readonly typeDefs: DocumentNode

  constructor(
    @inject(NodeFS) filesystem: typeof fs,
    @inject(ProcessEnv) private readonly env: NodeJS.ProcessEnv,
    @injectAll(GraphQLResolvers) private readonly resolvers: Resolvers[]
  ) {
    this.typeDefs = gql(
      filesystem.readFileSync(
        join(__dirname, '..', '..', '..', 'schema.graphql'),
        'utf8'
      )
    )
  }

  /**
   * Create an App using the standard AppRegistry for use in Production-like environments.
   */
  static create(): App {
    container.register(AppRegistry, {useClass: AppRegistry})

    return container.resolve(App)
  }

  private getResolvers(): Schema.Resolvers<Context> {
    return merge(
      {
        DateTime: GraphQLDateTime,
        JSON: GraphQLJSON,
        JSONObject: GraphQLJSONObject,
      },
      ...this.resolvers.map((r) => r.getAll())
    )
  }

  async init(): Promise<Application> {
    const [
      nodeEnv = 'production',
      audience = 'production',
      domain = 'storyverse.auth0.com',
    ] = getVars(
      [Vars.NodeEnv, Vars.OAuth2Audience, Vars.OAuth2Domain],
      this.env
    )

    const isDev = nodeEnv === 'development'

    const app = express()
      .disable('x-powered-by')
      .use(morgan(isDev ? 'dev' : 'combined'))

    app.use(
      jwt({
        algorithms: ['RS256'],
        audience,
        issuer: `https://${domain}/`,
        credentialsRequired: false,
        secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${domain}/.well-known/jwks.json`,
        }),
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
      typeDefs: this.typeDefs,
      resolvers: this.getResolvers(),
      context: getContext,
    })
    apollo.applyMiddleware({app})

    return app
  }
}
