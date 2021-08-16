import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import nlp from 'compromise'
import {Profile} from '@prisma/client'

import {NodeDebug} from '@storyverse/api/utils'
import {Actions, Output} from '@storyverse/messaging'

import {General} from './CommandResponses'
import {CommandContext, Terms} from './CommandUtils'
import UnknownCommand from './handlers/UnknownCommand'
import SayCommand from './handlers/SayCommand'

@injectable()
export default class CommandService {
  private readonly debug: Debug.IDebugger

  constructor(
    @inject(NodeDebug) debug = Debug,
    private readonly unknown: UnknownCommand,
    private readonly say: SayCommand
  ) {
    this.debug = debug(`storyverse:api:${CommandService.name}`)
  }

  /**
   * Handle Redist pub/sub events for the given WebSocket client.
   */
  handle = async (
    ws: WebSocket,
    {profile, command}: {profile?: Profile | null; command: string}
  ): Promise<void> => {
    this.debug(`Profile: ${profile?.id || 'Unknown'}, Command: ${command}`)

    if (!profile) {
      const action: Output = {
        type: Actions.output,
        output: "Sorry, I'm not sure who you are.",
      }

      ws.send(JSON.stringify(action))

      return
    }

    const parsed = nlp(command)

    // TODO: Handle more than one sentence.
    const phrase = parsed.sentences().list[0]
    const terms = phrase.terms()
    const verbs = terms.filter((term) => term.tags.Verb)

    if (verbs[0]) {
      return this.route(ws, {verb: verbs[0], terms, profile})
    }

    this.debug('Unknown phrase:', phrase.terms().map(Terms.toString))

    const action: Output = {
      type: Actions.output,
      output: General.unknown({profile}),
    }

    return ws.send(JSON.stringify(action))
  }

  private route = async (
    ws: WebSocket,
    context: CommandContext
  ): Promise<void> => {
    const {verb} = context

    switch (verb.reduced) {
      case 'say':
        return this.say.handle(ws, context)
      default:
        return this.unknown.handle(ws, context)
    }
  }
}
