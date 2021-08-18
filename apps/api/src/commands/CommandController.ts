import Debug from 'debug'
import {inject, injectable} from 'tsyringe'
import {NodeDebug} from '@storyverse/api/utils/Injection'
import {AppRequest} from '@storyverse/api/utils'
import {PrismaClient} from '@prisma/client'

import {Store} from '../socket/SocketState'
import CommandService from './CommandService'

@injectable()
export default class CommandController {
  // private readonly debug: Debug.IDebugger

  constructor(
    private readonly service: CommandService,
    private readonly prisma: PrismaClient,
    @inject(NodeDebug) _debug = Debug
  ) {
    // this.debug = debug(`storyverse:api:${CommandController.name}`)
  }

  async handle(req: AppRequest, state: Store, {command}: {command: string}) {
    const sub = req.user?.sub

    const profile = await this.prisma.profile.findFirst({
      include: {user: {select: {id: true, username: true}}},
      where: {user: {username: sub}},
    })

    return this.service.handle(state, {profile, command})
  }
}
