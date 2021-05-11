import {PrismaClient, Profile} from '@prisma/client'
import {injectable} from 'tsyringe'

import {SeriesRoles} from '@storyverse/graphql/api/Schema'

import {NotFoundError} from '../utils/Errors'
import AuthzService from '../authz/AuthzService'
import {ManageSeries} from '../universes/UniverseRoles'
import * as UniverseUtils from '../universes/UniverseUtils'
import {Update, ManageRoles} from './SeriesRoles'
import {getSubject} from './SeriesUtils'

@injectable()
export default class SeriesAuthz {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authz: AuthzService
  ) {}

  create = async (username: string, universeId: string): Promise<Profile> => {
    const profile = await this.getProfile(username)
    const universe = await this.getUniverse(universeId)

    await this.authz.requirePermissions(
      profile.id,
      UniverseUtils.getSubject(universe.id),
      [ManageSeries]
    )

    return profile
  }

  update = async (username: string, id: string) => {
    const existing = await this.getExisting(id)
    const profile = await this.getProfile(username)

    const bySeries = await this.authz.hasPermissions(
      profile.id,
      getSubject(existing.id),
      [Update]
    )
    if (bySeries) {
      return existing
    }

    await this.authz.requirePermissions(
      profile.id,
      UniverseUtils.getSubject(existing.universeId),
      [ManageSeries]
    )

    return existing
  }

  delete = async (username: string, id: string) => {
    const existing = await this.getExisting(id)
    const profile = await this.getProfile(username)

    await this.authz.requirePermissions(
      profile.id,
      UniverseUtils.getSubject(existing.universeId),
      [ManageSeries]
    )

    return existing
  }

  /**
   * Grant Roles to a particular Profile
   */
  grantRoles = async (
    username: string,
    universeId: string,
    profileId: string,
    roles: SeriesRoles[]
  ) => {
    const universe = await this.getExisting(universeId)

    const profile = await this.getProfile(username)
    const subject = getSubject(universe.id)

    await this.authz.requirePermissions(profile.id, subject, [ManageRoles])

    await this.authz.grantRoles(profileId, subject, roles)
  }

  private getExisting = async (id: string) => {
    const existing = await this.prisma.series.findFirst({
      where: {id},
    })
    if (!existing) {
      throw new NotFoundError('Not found')
    }

    return existing
  }

  private getProfile = async (username: string) => {
    const profile = await this.prisma.profile.findFirst({
      include: {user: true},
      where: {user: {username}},
    })
    if (!profile) {
      throw new NotFoundError('Profile not found')
    }

    return profile
  }

  private getUniverse = async (id: string) => {
    const universe = await this.prisma.universe.findFirst({
      where: {id},
    })

    if (!universe) {
      throw new NotFoundError('Universe not found')
    }

    return universe
  }
}
