import {PrismaClient} from '@prisma/client'
import {ForbiddenError, UserInputError} from 'apollo-server-core'

import {Profile} from '../Schema'

export default class UniverseAuthz {
  private readonly prisma: PrismaClient

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient()
  }

  create = async (
    username: string,
    ownerProfileId: string
  ): Promise<Profile> => {
    const profile = await this.prisma.profile.findFirst({
      include: {
        user: true,
      },
      where: {id: ownerProfileId},
    })

    if (!profile) {
      throw new UserInputError(
        'The specified owned-by `Profile` was not found.'
      )
    }

    if (username !== profile.user.username) {
      throw new ForbiddenError('Authorization required')
    }

    return profile
  }
}
