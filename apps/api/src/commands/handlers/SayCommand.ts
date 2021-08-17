import WebSocket from 'ws'
import {injectable} from 'tsyringe'

import {Actions, Output} from '@storyverse/messaging'

import {CommandContext} from '../CommandUtils'

@injectable()
export default class SayCommand {
  async handle(ws: WebSocket, context: CommandContext): Promise<void> {
    const {parsed, profile} = context

    const quote = parsed.splitAfter('#Say').out('array')[1]

    const action: Output = {
      type: Actions.output,
      output: `${profile.displayName} says, "${quote}"`,
    }

    return ws.send(JSON.stringify(action))
  }
}
