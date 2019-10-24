import http from 'http'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import chalk from 'chalk'
import express, {Request, Response, NextFunction} from 'express'
import noop from 'express-noop'
import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import playground from 'graphql-playground-middleware-express'
import {PostGraphileOptions, postgraphile} from 'postgraphile'

import {Auth, Database, Server, Environment} from './Config'
import Plugins from './Plugins'

export async function create() {
  const app = express()

  const jwtCheck = jwt({
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
  })

  const options: PostGraphileOptions = {
    appendPlugins: Plugins.plugins,
    additionalGraphQLContextFromRequest: Plugins.getGraphQLContext,
    // @ts-ignore - error type mismatch
    handleErrors: Plugins.handleErrors,
    pgSettings: Plugins.pgSettings,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    retryOnInitFail: true,
  }

  const playgroundMiddleware = playground({
    endpoint: '/graphql',
    settings: {
      // @ts-ignore - incomplete type
      'schema.polling.enable': false,
    },
  })

  app
    .disable('x-powered-by')
    .use(morgan(Environment.isDev ? 'dev' : 'combined'))
    .get('/', (_req, res) => {
      res.send('ok')
    })
    .get('/graphql', noop(Environment.isDev, playgroundMiddleware))
    .use(jwtCheck)
    .use(bodyParser.json())
    .use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(err)

      res.status(400).send('{}')
    })
    .use(postgraphile(Database.url, 'public', options))

  return app
}

export async function run() {
  const app = await create()
  const server = http.createServer(app)

  server.listen(Server.port, () => {
    console.log(
      chalk.cyan(
        `> Started API on port ${chalk.yellow(Server.port.toString())}`
      )
    )
  })

  server.on('close', () => {
    console.log(chalk.cyan(`> API shutting down`))
  })
}

if (require.main === module) {
  run()
}
