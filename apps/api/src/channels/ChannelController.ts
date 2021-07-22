import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {Redis} from 'ioredis'
import {IORedis, NodeDebug} from '@storyverse/api/utils/Injection'

import ChannelService from './ChannelService'

export const getChannel = (storyId: string) => `story:${storyId}`

export const getStoryId = (channel: string) => channel.replace('story:', '')

@injectable()
export default class ChannelController {
  private readonly debug: Debug.IDebugger

  constructor(
    private readonly service: ChannelService,
    @inject(IORedis) private readonly redis: Redis,
    @inject(NodeDebug) debug = Debug
  ) {
    this.debug = debug(`storyverse:api:${ChannelController.name}`)
  }

  /**
   * Register a WebSocket client with the Redis pub/sub channel for a Story.
   */
  registerClient(storyId: string, ws: WebSocket) {
    const channel = getChannel(storyId)

    this.redis.on('message', this.service.handleMessage(ws))

    this.redis.on('messageBuffer', this.service.handleMessage(ws))

    this.redis.subscribe(channel, (err, _count) => {
      if (err) {
        this.debug(
          `Error during Redis subscribe for channel "${channel}": ${err.message}`
        )

        return
      }
    })
  }
}
