import {Injectable, ForbiddenException, NotFoundException} from '@nestjs/common'

import Profile from '../profiles/Profile.entity'
import ProfilesService from '../profiles/ProfilesService'
import RoleGrantsService from '../authorization/RoleGrantsService'
import * as UniverseUtils from '../universes/UniverseUtils'
import * as UniverseRoles from '../universes/UniverseRoles'
import Series from './Series.entity'
import SeriesService from './SeriesService'
import {Update} from './SeriesRoles'
import {subject} from './SeriesUtils'

@Injectable()
export default class SeriesAuthz {
  constructor(
    private readonly service: SeriesService,
    private readonly profiles: ProfilesService,
    private readonly roles: RoleGrantsService
  ) {}

  create = async (username: string, universeId: string): Promise<void> => {
    const profile = await this.getProfile(username)

    await this.roles.requirePermissions(
      [UniverseRoles.ManageSeries],
      profile.id,
      UniverseUtils.subject(universeId)
    )
  }

  update = async (username: string, id: string): Promise<Series> => {
    const existing = await this.getExisting(id)
    const profile = await this.getProfile(username)

    await this.roles.requirePermissions(
      [Update],
      profile.id,
      subject(existing.id)
    )

    return existing
  }

  delete = async (username: string, id: string): Promise<Series> => {
    const existing = await this.getExisting(id)
    const profile = await this.getProfile(username)

    await this.roles.requirePermissions(
      [UniverseRoles.ManageSeries],
      profile.id,
      UniverseUtils.subject(existing.universeId)
    )

    return existing
  }

  private getExisting = async (id: string): Promise<Series> => {
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
