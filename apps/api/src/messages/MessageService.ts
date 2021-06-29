import {Redis} from 'ioredis'
import {inject, injectable} from 'tsyringe'
import {IORedis} from '@storyverse/api/utils'

import {getChannel} from '../channels/ChannelController'

@injectable()
export default class MessageService {
  constructor(@inject(IORedis) private readonly redis: Redis) {}

  /**
   * Create a new message on the Redis pub/sub channel for a Story.
   */
  async send(input: {
    storyId: string
    username: string
    text: string
  }): Promise<void> {
    const {storyId, username, text} = input

    const channel = getChannel(storyId)

    await this.redis.publish(channel, JSON.stringify({username, text}))
  }
}
