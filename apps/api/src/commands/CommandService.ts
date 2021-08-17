import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {Profile} from '@prisma/client'

import {NodeDebug} from '@storyverse/api/utils'
import {Actions, Output} from '@storyverse/messaging'

import SayCommand from './handlers/SayCommand'
import {parse} from './CommandNlp'
import {selectFrom} from './CommandUtils'

@injectable()
export default class CommandService {
  private readonly debug: Debug.IDebugger

  constructor(
    @inject(NodeDebug) debug = Debug,
    private readonly say: SayCommand
  ) {
    this.debug = debug(`storyverse:api:${CommandService.name}`)
  }

  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  async handle(
    ws: WebSocket,
    {profile, command}: {profile?: Profile | null; command: string}
  ): Promise<void> {
    this.debug(`Profile: ${profile?.id || 'Unknown'}, Command: ${command}`)

    if (!profile) {
      const action: Output = {
        type: Actions.output,
        output: "Sorry, I'm not sure who you are.",
      }

      ws.send(JSON.stringify(action))

      return
    }

    const parsed = parse(command)

    if (parsed.has('#Command')) {
      if (parsed.has('#Say')) {
        return this.say.handle(ws, {parsed, profile})
      }

      // This has a #Command, but not one we recognize. Let it flow through, but log it.
      this.debug('Unknown command:', parsed.text)
    }

    // This doesn't even have a verb, so go with a general unknown response.
    const action: Output = {
      type: Actions.output,
      output: selectFrom([
        `I'm not sure what that means, ${profile.displayName}.`,
        "I'm sorry, I didn't understand that.",
        "I don't understand. Can you rephrase that?",
      ]),
    }

    return ws.send(JSON.stringify(action))
  }
}
