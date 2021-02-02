import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import User from '../users/User.entity'
import Profile from './Profile.entity'
import ProfilesService from './ProfilesService'
import {isOwner} from './ProfileUtils'

@Injectable()
export default class ProfileAuthz {
  constructor(private readonly service: ProfilesService) {}

  create = (username: string) => (user?: User): User => {
    if (!user) {
      throw new BadRequestException(
        'An existing User must be found or valid UserInput must be provided.'
      )
    }

    if (username !== user.username) {
      throw new ForbiddenException()
    }

    return user
  }

  update = async (username: string, id: string): Promise<Profile> => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    throw new ForbiddenException()
  }

  delete = this.update

  private getExisting = async (id: string): Promise<Profile> => {
    const existing = await this.service.findOne({where: {id}})

    if (!existing) {
      throw new NotFoundException()
    }

    return existing
  }
}
