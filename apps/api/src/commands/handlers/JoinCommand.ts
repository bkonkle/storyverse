import {injectable} from 'tsyringe'

import {Actions, Output} from '@storyverse/messaging'

import {Store} from '../../socket/SocketState'
import {CommandContext} from '../CommandUtils'

@injectable()
export default class JoinCommand {
  async handle(state: Store, context: CommandContext): Promise<void> {
    const {socket} = state.getState()
    const {command, profile} = context

    const quote = command.splitAfter('#Join').out('array')[1]

    const action: Output = {
      type: Actions.output,
      output: `${profile.displayName} joins "${quote}"`,
    }

    return socket.send(JSON.stringify(action))
  }
}
