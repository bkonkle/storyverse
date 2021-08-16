import Debug from 'debug'
import WebSocket from 'ws'
import {inject, injectable} from 'tsyringe'

import {NodeDebug} from '@storyverse/api/utils'
import {Actions, Output} from '@storyverse/messaging'

import {CommandContext, Terms} from '../CommandUtils'

@injectable()
export default class UnknownCommand {
  private readonly debug: Debug.IDebugger

  constructor(@inject(NodeDebug) debug = Debug) {
    this.debug = debug(`storyverse:api:${UnknownCommand.name}`)
  }

  async handle(ws: WebSocket, context: CommandContext): Promise<void> {
    const {verb, terms} = context

    this.debug('Unknown command:', terms.map(Terms.toString))

    const action: Output = {
      type: Actions.output,
      output: `I don't know how to ${verb.text}.`,
    }

    return ws.send(JSON.stringify(action))
  }
}
