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
import chalk from 'chalk'
import http from 'http'
import repeat from 'lodash/repeat'

import {Prisma} from '@storyverse/api/utils'
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
import SocketService from './socket/SocketService'

@injectable()
export default class App {
  appName = 'Storyverse'

  private readonly typeDefs: DocumentNode

  constructor(
    private readonly socket: SocketService,
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

  init(): Application {
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

  async run(application?: Application): Promise<void> {
    const app = application || this.init()

    const port = this.config.get('port')
    const portStr = chalk.yellow(port.toString())

    const server = http.createServer(app)

    // Handle upgrade events with `ws`
    this.socket.init(server)

    server.listen(port, () => {
      const padding = this.appName.length < 9 ? 0 : this.appName.length - 9

      console.log(
        chalk.cyan(
          `> Started ${chalk.blue(this.appName)} at:  ${chalk.green(
            `http://localhost:${portStr}`
          )}`
        )
      )
      console.log(
        chalk.cyan(
          `> ${chalk.blue('GraphQL')} available at:  ${repeat(
            ' ',
            padding
          )}${chalk.green(`http://localhost:${portStr}/graphql`)}`
        )
      )
      console.log(
        chalk.cyan(
          `> ${chalk.blue('WebSocket')} is handling:  ${chalk.yellow(
            'upgrade'
          )}`
        )
      )
    })

    server.on('close', () => {
      console.log(chalk.cyan(`> ${this.appName} shutting down`))
      Prisma.disconnect()
    })
  }
}
