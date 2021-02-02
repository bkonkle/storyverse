import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import ProfilesService from '../profiles/ProfilesService'
import RoleGrantsService from '../authorization/RoleGrantsService'
import UniversesService from './UniversesService'
import {Update} from './UniverseRoles'
import {isOwner, subject} from './UniverseUtils'

@Injectable()
export default class UniverseAuthz {
  constructor(
    private readonly service: UniversesService,
    private readonly profiles: ProfilesService,
    private readonly roles: RoleGrantsService
  ) {}

  create = async (username: string, ownerProfileId: string) => {
    const profile = await this.profiles.findOne({
      where: {id: ownerProfileId},
    })

    if (!profile) {
      throw new BadRequestException(
        'The specified owned-by `Profile` was not found.'
      )
    }

    if (username !== profile.user.username) {
      throw new ForbiddenException()
    }
  }

  update = async (username: string, id: string) => {
    const existing = await this.service.findOne({where: {id}})

    if (!existing) {
      throw new NotFoundException()
    }

    if (isOwner(existing, username)) {
      return existing
    }

    const profile = await this.profiles.getByUsername(username)
    if (!profile) {
      throw new ForbiddenException()
    }

    await this.roles.requirePermissions(
      [Update],
      profile.id,
      subject(existing.id)
    )
  }

  remove = this.update
}
