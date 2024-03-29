import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import {PrismaClient} from '@prisma/client'
import {AppRequest, NodeDebug} from '@storyverse/api/utils'

import MessageService from './MessageService'

@injectable()
export default class MessageController {
  debug: Debug.IDebugger

  constructor(
    private readonly service: MessageService,
    private readonly prisma: PrismaClient,
    @inject(NodeDebug) debug = Debug
  ) {
    this.debug = debug(`storyverse:api:${MessageController.name}`)
  }

  /**
   * Create a new message on the Redis pub/sub channel for a Story.
   */
  async send(
    req: AppRequest,
    input: {
      storyId: string
      text: string
    }
  ): Promise<void> {
    const sub = req.user?.sub
    if (!sub) {
      this.debug('Message received without user.sub')

      return
    }

    const profile = await this.prisma.profile.findFirst({
      include: {user: {select: {id: true, username: true}}},
      where: {user: {username: sub}},
    })

    if (!profile) {
      this.debug(`Unable to find a Profile associated with username: ${sub}`)

      return
    }

    return this.service.send({...input, profile})
  }
}
