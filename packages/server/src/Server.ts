import express from 'express'
import morgan from 'morgan'
import {withGraft, run} from '@graft/server'

import {Server, Graft, Environment} from './Config'

export function init() {
  const app = express()
    .disable('x-powered-by')
    .use(morgan(Environment.isDev ? 'dev' : 'combined'))
    .get('/', (_req, res) => {
      res.send('ok')
    })

  return withGraft(app, Graft.config)
}

export function start() {
  run(init(), Server.port)
}

if (require.main === module) {
  start()
}
