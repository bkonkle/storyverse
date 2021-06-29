import chalk from 'chalk'
import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {NodeDebug} from '@storyverse/api/utils'

import ChannelController from '../channels/ChannelController'
import MessageController from '../messages/MessageController'
import {Action, Actions, ActionTypes} from './SocketTypes'

@injectable()
export default class SocketService {
  private readonly debug: Debug.IDebugger

  constructor(
    private readonly channel: ChannelController,
    private readonly message: MessageController,
    @inject(NodeDebug) debug?: Debug.IDebugger
  ) {
    this.debug = debug || Debug(`storyverse:api:${SocketService.name}`)
  }

  start = (port: number) => {
    const server = new WebSocket.Server({port})

    server.on('listening', this.onListen(port))
    server.on('error', this.onError)
    server.on('connection', this.onConnection)
  }

  private onListen = (port: number) => (err?: Error) => {
    if (err) {
      this.debug(err.message)
    } else {
      console.log(
        `${chalk.blue('WebSocket')} is listening on port ${chalk.green(
          port.toString()
        )}`
      )
    }
  }

  private onError = (err: Error) => {
    console.error(chalk.red('ws.Server listen error:'), err)
  }

  private onConnection = (ws: WebSocket) => {
    // Send periodic pings to keep the connection alive
    const ping = setInterval(() => ws.send(Actions.ping()), 4500)

    ws.on('message', (event) => {
      this.route(ws, event).catch((err: Error) => {
        this.debug('Error while handling WebSocket event:', err)
      })
    })

    ws.on('close', () => {
      clearInterval(ping)
    })

    ws.on('error', (err) => {
      this.debug('Websocket Error:', err)
    })
  }

  private route = async (ws: WebSocket, event: WebSocket.Data) => {
    const action: Action | undefined = JSON.parse(event.toString())

    if (!action) {
      return
    }

    if (action.type === ActionTypes.clientRegister) {
      return this.channel.registerClient(action.payload.storyId, ws)
    }

    if (action.type === ActionTypes.messageSend) {
      return this.message.send(action.payload)
    }
  }
}
