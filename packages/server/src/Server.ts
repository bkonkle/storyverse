import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import http from 'http'
import jwt from 'express-jwt'
import morgan from 'morgan'
import noop from 'express-noop'
import playground from 'graphql-playground-middleware-express'
import {postgraphile} from '@graft/server'

import {Database, Server, PostGraphile, Environment} from './Config'

export async function create() {
  const app = express()

  const jwtCheck = jwt(PostGraphile.jwt)
  const playgroundMiddleware = playground(PostGraphile.playground)
  const pgMiddleware = postgraphile(Database.url, 'public', PostGraphile.config)

  app
    .disable('x-powered-by')
    .use(morgan(Environment.isDev ? 'dev' : 'combined'))
    .get('/', (_req, res) => {
      res.send('ok')
    })
    .get('/graphql', noop(Environment.isDev, playgroundMiddleware))
    .use(jwtCheck)
    .use(cors())
    .use(bodyParser.json())
    .use(pgMiddleware)

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
