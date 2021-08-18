import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import {Profile} from '@prisma/client'

import {NodeDebug} from '@storyverse/api/utils'
import {Actions, Output} from '@storyverse/messaging'

import {Store} from '../socket/SocketState'
import SayCommand from './handlers/SayCommand'
import JoinCommand from './handlers/JoinCommand'
import {parse} from './CommandNlp'
import {CommandContext, selectFrom} from './CommandUtils'

@injectable()
export default class CommandService {
  private readonly debug: Debug.IDebugger

  constructor(
    @inject(NodeDebug) debug = Debug,
    private readonly say: SayCommand,
    private readonly join: JoinCommand
  ) {
    this.debug = debug(`storyverse:api:${CommandService.name}`)
  }

  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  async handle(
    state: Store,
    {profile, command}: {profile?: Profile | null; command: string}
  ): Promise<void> {
    this.debug(`Profile: ${profile?.id || 'Unknown'}, Command: ${command}`)

    const {socket} = state.getState()

    if (!profile) {
      const action: Output = {
        type: Actions.output,
        output: "Sorry, I'm not sure who you are.",
      }

      socket.send(JSON.stringify(action))

      return
    }

    const parsed = parse(command)

    if (parsed.has('#Command')) {
      const context: CommandContext = {command: parsed, profile}

      if (parsed.has('#Join')) {
        return this.join.handle(state, context)
      }

      if (parsed.has('#Say')) {
        return this.say.handle(state, context)
      }

      // This starts with a #Command, but not one we recognize. Let it flow through, but log it.
      this.debug('Unknown command:', parsed.text)
    }

    // This doesn't start with a command, so go with a general unknown response.
    const action: Output = {
      type: Actions.output,
      output: selectFrom([
        `I'm not sure what that means, ${profile.displayName}.`,
        "I'm sorry, I didn't understand that.",
        "I don't understand. Can you rephrase that?",
      ]),
    }

    return socket.send(JSON.stringify(action))
  }
}
