import chalk from 'chalk'
import {Application} from 'express'
import http from 'http'

import {init} from './App'

export function run(label: string, app: Application, port: number): void {
  const portStr = chalk.yellow(port.toString())

  const server = http.createServer(app)

  server.listen(port, () => {
    console.log(chalk.cyan(`> Started ${label} on port ${portStr}`))
  })

  server.on('close', () => {
    console.log(chalk.cyan(`> ${label} shutting down`))
  })
}

export const start = async (): Promise<void> => {
  const {PORT} = process.env
  const port = PORT ? Number(PORT) : 3000
  const app = await init()

  run('Storyverse', app, port)
}

if (require.main === module) {
  start().catch(console.error)
}