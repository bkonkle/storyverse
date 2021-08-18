import {injectable} from 'tsyringe'
import {PrismaClient} from '@prisma/client'

import {Actions, Output} from '@storyverse/messaging'

import {Store} from '../../socket/SocketState'
import {CommandContext} from '../CommandUtils'

@injectable()
export default class ListCommand {
  constructor(private readonly prisma: PrismaClient) {}

  async handle(state: Store, context: CommandContext): Promise<void> {
    const {socket} = state.getState()
    const {command} = context

    const noun = command.nouns(0).toSingular()
    const entity = noun.json()[0]

    switch (entity.text) {
      case 'story': {
        const stories = await this.prisma.story.findMany()

        const action: Output = {
          type: Actions.output,
          output: `Stories: ${stories.join(', ')}`,
        }

        return socket.send(JSON.stringify(action))
      }
      default: {
        const action: Output = {
          type: Actions.output,
          output: `Sorry, I'm not sure what ${entity.article} ${entity.text} is.`,
        }

        return socket.send(JSON.stringify(action))
      }
    }
  }
}
