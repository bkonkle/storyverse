import chalk from 'chalk'
import {Application} from 'express'
import http from 'http'

import {Prisma} from '@storyverse/api/utils'

import App from './App'

export function run(label: string, app: Application, port: number): void {
  const portStr = chalk.yellow(port.toString())

  const server = http.createServer(app)

  server.listen(port, () => {
    console.log(chalk.cyan(`> Started ${label} on port ${portStr}`))
  })

  server.on('close', () => {
    console.log(chalk.cyan(`> ${label} shutting down`))
    Prisma.disconnect()
  })
}

export const start = async (): Promise<void> => {
  const PORT = process.env.port || process.env.PORT
  const port = PORT ? Number(PORT) : 4000

  const app = App.create()

  run('Storyverse', await app.init(), port)
}

start().catch(console.error)
