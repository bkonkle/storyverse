import {injectable} from 'tsyringe'

import {Actions, Output} from '@storyverse/messaging'

import {Store} from '../../socket/SocketState'
import {CommandContext} from '../CommandUtils'

@injectable()
export default class SayCommand {
  async handle(state: Store, context: CommandContext): Promise<void> {
    const {socket, story} = state.getState()
    const {command, profile} = context

    const quote = command.splitAfter('#Say').out('array')[1]

    if (story.id) {
      const action: Output = {
        type: Actions.output,
        output: `${profile.displayName} says, "${quote}"`,
      }

      return socket.send(JSON.stringify(action))
    }

    const action: Output = {
      type: Actions.output,
      output: `You haven't joined a story yet. Use "list stories" to see what stories are available for you to join.`,
    }

    return socket.send(action)
  }
}
