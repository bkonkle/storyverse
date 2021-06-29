import 'reflect-metadata'
import * as fs from 'fs'
import {GraphQLJSONObject} from 'graphql-type-json'
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
import {
  Context,
  Config,
  NodeFS,
  Resolvers,
  GraphQLDateTime,
  GraphQLResolvers,
  getContext,
} from '@storyverse/api/utils'

import AppModule from './AppModule'

@injectable()
export default class App {
  private readonly typeDefs: DocumentNode

  constructor(
    @inject(NodeFS) filesystem: typeof fs,
    @inject(Config) private readonly config: Config,
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
   * Create an App using the standard AppModule for use in Production-like environments.
   */
  static create(): App {
    container.register(AppModule, {useClass: AppModule})

    return container.resolve(App)
  }

  private getResolvers(): Schema.Resolvers<Context> {
    return merge(
      {
        DateTime: GraphQLDateTime,
        JSON: GraphQLJSONObject,
      },
      ...this.resolvers.map((r) => r.getAll())
    )
  }

  async init(): Promise<Application> {
    const {
      env,
      auth: {audience, domain},
    } = this.config.getProperties()

    const isDev = env === 'development'
    const isTest = env === 'test'

    const app = express().disable('x-powered-by')

    if (isDev) {
      app.use(morgan('dev'))
    } else if (!isTest) {
      app.use(morgan('combined'))
    }

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
