import express, {Application} from 'express'
import morgan from 'morgan'
import {Server} from 'http'
import {Pool} from 'pg'
import {withGraft} from '@graft/server'

import {Database, Graft} from '../src/Config'

export interface TestApp {
  app: Application
  pool: Pool
  close(): Promise<void>
}

export async function init() {
  const app = express().use(morgan('dev'))

  const server = await new Promise<Server>(resolve => {
    const listener = app.listen(() => resolve(listener))
  })

  const pool = new Pool({
    user: Database.user,
    password: Database.password,
    host: Database.host,
    port: Database.port,
    database: Database.database,
    min: Database.poolMin,
    max: Database.poolMax,
    idleTimeoutMillis: Database.poolIdle,
  })

  const graft = withGraft(app, {
    ...Graft.config,
    database: {url: undefined, pool},
  })

  const close = async () => {
    await pool.end()
    await new Promise(resolve => server.close(resolve))
  }

  return {app: graft, pool, close}
}
