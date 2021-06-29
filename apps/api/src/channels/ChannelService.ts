import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {NodeDebug} from '@storyverse/api/utils'

import {Message} from '../messages/MessageTypes'
import {Actions} from '../socket/SocketTypes'

@injectable()
export default class ChannelService {
  private readonly debug: Debug.IDebugger

  constructor(@inject(NodeDebug) debug?: Debug.IDebugger) {
    this.debug = debug || Debug(`storyverse:api:${ChannelService.name}`)
  }

  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  handleMessage =
    (ws: WebSocket) =>
    (channel: string | Buffer, message: string | Buffer): void => {
      const {username, text}: Partial<Message> = JSON.parse(`${message}`)

      if (!username) {
        this.debug(
          `Error: Message received on channel "${channel}" with no username - ${message}`
        )

        return
      }

      if (!text) {
        this.debug(
          `Error: Message received on channel "${channel}" with no text - ${message}`
        )

        return
      }

      const action = Actions.receiveMessage(username, text)

      ws.send(JSON.stringify(action))
    }
}
