import http from 'http'
import morgan from 'koa-morgan'
import bodyParser from 'koa-bodyparser'
import chalk from 'chalk'
import Koa from 'koa'
import jwt from 'koa-jwt'
import jwks from 'jwks-rsa'
import Router, {IMiddleware} from 'koa-router'
import playground from 'graphql-playground-middleware-koa'
import {PostGraphileOptions, postgraphile} from 'postgraphile'

import {Auth, Database, Server, Environment} from './Config'
import Plugins from './Plugins'

export const catchErrors: Koa.Middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body =
      err.publicMessage ||
      '{"error": "An error has occurred. Please try your request again later."}'
    ctx.app.emit('error', err, ctx)
  }
}

export async function create() {
  const app = new Koa()
  const router = new Router()

  app.on('error', (err: Error, _ctx: Koa.Context) => {
    console.error(err)
  })

  const jwtCheck = jwt({
    // @ts-ignore jwks-rsa types are inaccurate - it returns a SecretLoader
    secret: jwks.koaJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: Auth.jwksUri,
    }),
    audience: Auth.audience,
    issuer: Auth.issuer,
    algorithms: ['RS256'],
    passthrough: true,
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

  const playgroundMiddleware: IMiddleware = playground({
    endpoint: '/graphql',
    settings: {
      // @ts-ignore - incomplete type
      'schema.polling.enable': false,
    },
  })

  app.use(morgan(Environment.isDev ? 'dev' : 'combined'))
  app.use(catchErrors)
  app.use(jwtCheck)
  app.use(bodyParser())

  router.get('/', async (ctx, _next) => {
    ctx.body = 'ok'
  })

  if (Environment.isDev) {
    router.get('/graphql', playgroundMiddleware)
  }

  router.post('/graphql', postgraphile(Database.url, 'public', options))

  app.use(router.routes()).use(router.allowedMethods())

  return app
}

export async function run() {
  const app = await create()
  const server = http.createServer(app.callback())

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
