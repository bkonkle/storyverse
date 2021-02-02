import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import Profile from '../profiles/Profile.entity'
import ProfilesService from '../profiles/ProfilesService'
import RoleGrantsService from '../authorization/RoleGrantsService'
import Universe from './Universe.entity'
import UniversesService from './UniversesService'
import {Update, Delete} from './UniverseRoles'
import {isOwner, subject} from './UniverseUtils'

@Injectable()
export default class UniverseAuthz {
  constructor(
    private readonly service: UniversesService,
    private readonly profiles: ProfilesService,
    private readonly roles: RoleGrantsService
  ) {}

  create = async (
    username: string,
    ownerProfileId: string
  ): Promise<Profile> => {
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

    return profile
  }

  update = async (username: string, id: string): Promise<Universe> => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    const profile = await this.getProfile(username)

    await this.roles.requirePermissions(
      [Update],
      profile.id,
      subject(existing.id)
    )

    return existing
  }

  delete = async (username: string, id: string): Promise<Universe> => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    const profile = await this.getProfile(username)

    await this.roles.requirePermissions(
      [Delete],
      profile.id,
      subject(existing.id)
    )

    return existing
  }

  private getExisting = async (id: string): Promise<Universe> => {
    const existing = await this.service.findOne({where: {id}})
    if (!existing) {
      throw new NotFoundException()
    }

    return existing
  }

  private getProfile = async (username: string): Promise<Profile> => {
    const profile = await this.profiles.getByUsername(username)
    if (!profile) {
      throw new ForbiddenException()
    }

    return profile
  }
}
