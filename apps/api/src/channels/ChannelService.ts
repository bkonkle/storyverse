import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {NodeDebug} from '@storyverse/api/utils'
import {Messages} from '@storyverse/messaging'

import {MessageEvent} from '../messages/MessageTypes'

@injectable()
export default class ChannelService {
  private readonly debug: Debug.IDebugger

  constructor(@inject(NodeDebug) debug = Debug) {
    this.debug = debug(`storyverse:api:${ChannelService.name}`)
  }

  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  handleMessage =
    (ws: WebSocket) =>
    (channel: string | Buffer, message: string | Buffer): void => {
      const {profile, text}: Partial<MessageEvent> = JSON.parse(`${message}`)

      if (!profile) {
        this.debug(
          `Error: Message received on channel "${channel}" with no profile - ${message}`
        )

        return
      }

      const {id, displayName} = profile

      if (!displayName) {
        this.debug(
          `Error: Message received on channel "${channel}" with no displayName - ${message}`
        )

        return
      }

      if (!text) {
        this.debug(
          `Error: Message received on channel "${channel}" with no text - ${message}`
        )

        return
      }

      // const action = Actions.receiveMessage(id, text)

      ws.send(JSON.stringify(action))
    }
}
