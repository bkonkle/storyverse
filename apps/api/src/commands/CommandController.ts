import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import WebSocket from 'ws'
import {NodeDebug} from '@storyverse/api/utils/Injection'
import {AppRequest} from '@storyverse/api/utils'
import {PrismaClient} from '@prisma/client'

import CommandService from './CommandService'

@injectable()
export default class CommandController {
  private readonly debug: Debug.IDebugger

  constructor(
    private readonly service: CommandService,
    private readonly prisma: PrismaClient,
    @inject(NodeDebug) debug = Debug
  ) {
    this.debug = debug(`storyverse:api:${CommandController.name}`)
  }

  async handle(req: AppRequest, ws: WebSocket, {command}: {command: string}) {
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

    return this.service.handle(ws, {profile, command})
  }
}
