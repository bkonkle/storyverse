import chalk from 'chalk'
import Debug from 'debug'
import {Socket} from 'net'
import {Server} from 'http'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {AppRequest, Config, NodeDebug, Jwt} from '@storyverse/api/utils'

import ChannelController from '../channels/ChannelController'
import MessageController from '../messages/MessageController'
import {Action, Actions, ActionTypes} from './SocketTypes'
import {Request, Response} from 'express'

@injectable()
export default class SocketService {
  private readonly debug: Debug.IDebugger

  constructor(
    private readonly channel: ChannelController,
    private readonly message: MessageController,
    @inject(Config) private readonly config: Config,
    @inject(NodeDebug) debug = Debug
  ) {
    this.debug = debug(`storyverse:api:${SocketService.name}`)
  }

  init = (server: Server) => {
    const wsServer = new WebSocket.Server({noServer: true})

    wsServer.on('error', this.onError)
    wsServer.on('connection', this.onConnection)

    const {
      auth: {audience, domain},
    } = this.config.getProperties()

    const jwt = Jwt.middleware({audience, domain})

    server.on('upgrade', (request: Request, socket: Socket, head) => {
      jwt(request, {} as Response, () => {
        wsServer.handleUpgrade(request, socket, head, (ws) => {
          wsServer.emit('connection', ws, request)
        })
      })
    })

    this.debug('Initialized!')
  }

  private onError = (err: Error) => {
    console.error(chalk.red('ws.Server listen error:'), err)
  }

  private onConnection = (ws: WebSocket, req: AppRequest) => {
    this.debug('Connection:', req.user)
    // Send periodic pings to keep the connection alive
    const ping = setInterval(
      () => ws.send(JSON.stringify(Actions.ping())),
      4500
    )

    ws.on('message', (event) => {
      this.debug('Message:', event)
      this.route(ws, event, req).catch((err: Error) => {
        this.debug('Error while handling WebSocket event:', err)
      })
    })

    ws.on('close', () => {
      clearInterval(ping)
    })

    ws.on('error', (err) => {
      clearInterval(ping)
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
