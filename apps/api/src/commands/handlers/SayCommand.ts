import WebSocket from 'ws'
import without from 'lodash/without'
import {injectable} from 'tsyringe'

import {Actions, Output} from '@storyverse/messaging'

import {CommandContext, Terms} from '../CommandUtils'

@injectable()
export default class SayCommand {
  async handle(ws: WebSocket, context: CommandContext): Promise<void> {
    const {verb, terms, profile} = context

    const quote = without(terms, verb)

    const action: Output = {
      type: Actions.output,
      output: `${profile.displayName} says: ${quote
        .map(Terms.toString)
        .join('')}`,
    }

    return ws.send(JSON.stringify(action))
  }
}
