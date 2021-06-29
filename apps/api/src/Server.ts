import chalk from 'chalk'
import {Application} from 'express'
import http from 'http'
import repeat from 'lodash/repeat'

import {Prisma} from '@storyverse/api/utils'

import App from './App'

export function run(label: string, app: Application, port: number): void {
  const portStr = chalk.yellow(port.toString())

  const server = http.createServer(app)

  server.listen(port, () => {
    const padding = label.length < 9 ? 0 : label.length - 9

    console.log(
      chalk.cyan(`> Started ${label} at:  http://localhost:${portStr}`)
    )
    console.log(
      chalk.cyan(
        `> GraphQL available at:  ${repeat(
          ' ',
          padding
        )}http://localhost:${portStr}/graphql`
      )
    )
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

  run('Storyverse', await app.init(port), port)
}

start().catch(console.error)
