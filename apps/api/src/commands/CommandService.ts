import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {NodeDebug} from '@storyverse/api/utils'
import {Profile} from '@prisma/client'
import {Actions, Output} from '@storyverse/messaging'

@injectable()
export default class CommandService {
  private readonly debug: Debug.IDebugger

  constructor(@inject(NodeDebug) debug = Debug) {
    this.debug = debug(`storyverse:api:${CommandService.name}`)
  }

  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  handle = (
    ws: WebSocket,
    {profile, command}: {profile: Profile; command: string}
  ): void => {
    this.debug(`Profile: ${profile.id}, Command: ${command}`)

    const action: Output = {
      type: Actions.output,
      output: `Message received, ${profile.displayName}! Command: ${command}`,
    }

    ws.send(JSON.stringify(action))
  }
}
