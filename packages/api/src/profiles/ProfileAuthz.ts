import {ForbiddenError, UserInputError} from 'apollo-server-core'
import {PrismaClient} from '@prisma/client'

import {User, Profile} from '../Schema'
import {NotFoundError} from '../utils/Errors'
import {isOwner} from './ProfileUtils'

export default class ProfileAuthz {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient()
  }

  create = (username: string) => (user?: User | null): User => {
    if (!user) {
      throw new UserInputError(
        'An existing User must be found or valid UserInput must be provided.'
      )
    }

    if (username !== user.username) {
      throw new ForbiddenError('Authorization required')
    }

    return user
  }

  update = async (username: string, id: string): Promise<Profile> => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    throw new ForbiddenError('Authorization required')
  }

  delete = this.update

  private getExisting = async (id: string): Promise<Profile> => {
    const existing = await this.prisma.profile.findFirst({where: {id}})

    if (!existing) {
      throw new NotFoundError('Not found')
    }

    return existing
  }
}
