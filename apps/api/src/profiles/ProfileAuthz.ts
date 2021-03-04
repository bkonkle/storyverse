import {ForbiddenError, UserInputError} from 'apollo-server-core'
import {PrismaClient} from '@prisma/client'

import {User} from '../Schema'
import Prisma from '../utils/Prisma'
import {NotFoundError} from '../utils/Errors'
import {isOwner} from './ProfileUtils'

export default class ProfileAuthz {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || Prisma.init()
  }

  create = (username: string) => (user?: User | null) => {
    if (!user) {
      throw new UserInputError('No user found with that id')
    }

    if (username !== user.username) {
      throw new ForbiddenError('Authorization required')
    }

    return user
  }

  update = async (username: string, id: string) => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    throw new ForbiddenError('Authorization required')
  }

  delete = this.update

  private getExisting = async (id: string) => {
    const existing = await this.prisma.profile.findFirst({
      include: {user: true},
      where: {id},
    })

    if (!existing) {
      throw new NotFoundError('Not found')
    }

    return existing
  }
}
