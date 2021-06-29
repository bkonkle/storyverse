import {Redis} from 'ioredis'
import {inject, injectable} from 'tsyringe'
import {PrismaClient, Profile} from '@prisma/client'
import {IORedis} from '@storyverse/api/utils'

import {getChannel} from '../channels/ChannelController'
import {MessageEvent} from './MessageTypes'

@injectable()
export default class MessageService {
  constructor(
    private readonly prisma: PrismaClient,
    @inject(IORedis) private readonly redis: Redis
  ) {}

  /**
   * Create a new message on the Redis pub/sub channel for a Story.
   */
  async send(input: {
    storyId: string
    profile: Profile
    text: string
  }): Promise<void> {
    const {storyId, profile, text} = input

    const message: MessageEvent = await this.prisma.message.create({
      include: {
        profile: {select: {id: true, displayName: true, picture: true}},
      },
      data: {
        text,
        storyId,
        profileId: profile.id,
      },
    })

    const channel = getChannel(storyId)

    await this.redis.publish(channel, JSON.stringify(message))
  }
}
