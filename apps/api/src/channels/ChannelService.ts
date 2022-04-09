import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {NodeDebug} from '@storyverse/api/utils'
import {Actions, Output} from '@storyverse/messaging'

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

      const action: Output = {
        type: Actions.output,
        output: `${text}`,
      }

      ws.send(JSON.stringify(action))
    }
}
