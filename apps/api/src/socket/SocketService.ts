import chalk from 'chalk'
import Debug from 'debug'
import {Socket} from 'net'
import {Server} from 'http'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {AppRequest, NodeDebug} from '@storyverse/api/utils'

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

  init = (server: Server) => {
    const ws = new WebSocket.Server({noServer: true})

    ws.on('error', this.onError)
    ws.on('connection', this.onConnection)

    server.on('upgrade', (request: AppRequest, socket: Socket, head) => {
      ws.handleUpgrade(request, socket, head, (ws) => {
        ws.emit('connection', ws, request)
      })
    })
  }

  private onError = (err: Error) => {
    console.error(chalk.red('ws.Server listen error:'), err)
  }

  private onConnection = (ws: WebSocket, req: AppRequest) => {
    // Send periodic pings to keep the connection alive
    const ping = setInterval(() => ws.send(Actions.ping()), 4500)

    ws.on('message', (event) => {
      this.route(ws, event, req).catch((err: Error) => {
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

  private route = async (
    ws: WebSocket,
    event: WebSocket.Data,
    req?: AppRequest
  ) => {
    const action: Action | undefined = JSON.parse(event.toString())

    if (!action) {
      return
    }

    if (action.type === ActionTypes.clientRegister) {
      return this.channel.registerClient(action.payload.storyId, ws)
    }

    if (action.type === ActionTypes.messageSend) {
      return this.message.send(action.payload, req)
    }
  }
}
