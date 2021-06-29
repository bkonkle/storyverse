import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import {PrismaClient} from '@prisma/client'
import {NodeDebug} from '@storyverse/api/utils'

import MessageService from './MessageService'

@injectable()
export default class MessageController {
  debug: Debug.IDebugger

  constructor(
    private readonly service: MessageService,
    private readonly prisma: PrismaClient,
    @inject(NodeDebug) debug?: Debug.IDebugger
  ) {
    this.debug = debug || Debug(`storyverse:api:${MessageController.name}`)
  }

  /**
   * Create a new message on the Redis pub/sub channel for a Story.
   */
  async send(input: {
    storyId: string
    profileId: string
    text: string
  }): Promise<void> {
    const {profileId, ...rest} = input

    // TODO: Figure out how to prevent one user from impersonating another.
    const profile = await this.prisma.profile.findFirst({
      where: {id: profileId},
    })

    if (!profile) {
      this.debug(`Unable to find a Profile with id: ${profileId}`)

      return
    }

    return this.service.send({...rest, profile})
  }
}
