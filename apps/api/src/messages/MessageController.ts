import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import {NodeDebug} from '@storyverse/api/utils'

import MessageService from './MessageService'

@injectable()
export default class MessageController {
  debug: Debug.IDebugger

  constructor(
    private readonly service: MessageService,
    @inject(NodeDebug) debug?: Debug.IDebugger
  ) {
    this.debug = debug || Debug(`storyverse:api:${MessageController.name}`)
  }

  /**
   * Create a new message on the Redis pub/sub channel for a Story.
   */
  async send(input: {storyId: string; username: string; text: string}) {
    return this.service.send(input)
  }
}
