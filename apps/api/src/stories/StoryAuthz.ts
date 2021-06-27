import {PrismaClient, Profile} from '@prisma/client'
import {ForbiddenError} from 'apollo-server-core'
import {injectable} from 'tsyringe'

import {NotFoundError} from '@storyverse/api/utils'

import AuthzService from '../authz/AuthzService'
import * as UniverseUtils from '../universes/UniverseUtils'
import {ManageSeries} from '../universes/UniverseRoles'
import * as SeriesUtils from '../series/SeriesUtils'
import {ManageStories} from '../series/SeriesRoles'

@injectable()
export default class StoryAuthz {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authz: AuthzService
  ) {}

  create = async (username: string, seriesId: string): Promise<Profile> => {
    const profile = await this.getProfile(username)

    const bySeries = await this.authz.hasPermissions(
      profile.id,
      SeriesUtils.getSubject(seriesId),
      [ManageStories]
    )
    if (bySeries) {
      return profile
    }

    const series = await this.getSeries(seriesId)

    await this.authz.requirePermissions(
      profile.id,
      UniverseUtils.getSubject(series.universeId),
      [ManageSeries]
    )

    return profile
  }

  update = async (username: string, id: string) => {
    const profile = await this.getProfile(username)
    const existing = await this.getExisting(id)

    const bySeries = await this.authz.hasPermissions(
      profile.id,
      SeriesUtils.getSubject(existing.series.id),
      [ManageStories]
    )
    if (bySeries) {
      return profile
    }

    await this.authz.requirePermissions(
      profile.id,
      UniverseUtils.getSubject(existing.series.universeId),
      [ManageSeries]
    )

    return existing
  }

  delete = async (username: string, id: string) => {
    const profile = await this.getProfile(username)
    const existing = await this.getExisting(id)

    const bySeries = await this.authz.hasPermissions(
      profile.id,
      SeriesUtils.getSubject(existing.series.id),
      [ManageStories]
    )
    if (bySeries) {
      return profile
    }

    await this.authz.requirePermissions(
      profile.id,
      UniverseUtils.getSubject(existing.series.universeId),
      [ManageSeries]
    )

    return existing
  }

  private getExisting = async (id: string) => {
    const existing = await this.prisma.story.findFirst({
      include: {series: true},
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
      throw new ForbiddenError('Authorization required')
    }

    return profile
  }

  private getSeries = async (id: string) => {
    const universe = await this.prisma.series.findFirst({
      where: {id},
    })

    if (!universe) {
      throw new NotFoundError('Series not found')
    }

    return universe
  }
}
