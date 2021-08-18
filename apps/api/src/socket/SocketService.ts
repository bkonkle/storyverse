import chalk from 'chalk'
import {Request, Response} from 'express'
import Debug from 'debug'
import {Socket} from 'net'
import {Server} from 'http'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'

import {AppRequest, Config, NodeDebug, Jwt} from '@storyverse/api/utils'
import {Action, Actions, Ping} from '@storyverse/messaging/Messages'

import CommandController from '../commands/CommandController'
import {createStore, Store} from './SocketState'

@injectable()
export default class SocketService {
  private readonly debug: Debug.IDebugger

  constructor(
    private readonly command: CommandController,
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
    const action: Ping = {type: Actions.ping}
    const ping = setInterval(() => ws.send(JSON.stringify(action)), 4500)
    const state = createStore(ws)

    ws.on('message', (evt) => {
      const event = evt.toString()

      this.debug('Message:', event)
      this.route(state, event, req).catch((err: Error) => {
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

  private route = async (state: Store, event: string, req: AppRequest) => {
    const action: Action | undefined = JSON.parse(event)

    if (!action) {
      return
    }

    if (action.type === Actions.command) {
      return this.command.handle(req, state, {command: action.command})
    }

    this.debug(`Unknown action type: ${action.type}:`, action)
  }
}
