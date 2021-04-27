import {ForbiddenError, UserInputError} from 'apollo-server-core'
import {PrismaClient} from '@prisma/client'

import {User} from '@storyverse/graphql/ApiSchema'

import {NotFoundError} from '../utils/Errors'
import {isOwner} from './ProfileUtils'
import {injectable} from 'tsyringe'

@injectable()
export default class ProfileAuthz {
  constructor(private readonly prisma: PrismaClient) {}

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
