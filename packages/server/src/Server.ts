import express from 'express'
import morgan from 'morgan'
import {withGraft, run} from '@graft/server'

import {Server, Graft, Environment} from './Config'

export function start() {
  const app = express()
    .disable('x-powered-by')
    .use(morgan(Environment.isDev ? 'dev' : 'combined'))
    .get('/', (_req, res) => {
      res.send('ok')
    })

  run(withGraft(app, Graft.config), Server.port)
}

if (require.main === module) {
  start()
}
