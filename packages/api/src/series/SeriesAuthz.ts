import {PrismaClient, Profile} from '@prisma/client'
import {ForbiddenError} from 'apollo-server-core'

import Prisma from '../utils/Prisma'
import {NotFoundError} from '../utils/Errors'
import AuthzService from '../authorization/AuthzService'
import {subject} from './SeriesUtils'
import {Update} from './SeriesRoles'
import {ManageSeries} from '../universes/UniverseRoles'
import * as UniverseUtils from '../universes/UniverseUtils'

export default class SeriesAuthz {
  private readonly prisma: PrismaClient
  private readonly authz: AuthzService

  constructor(prisma?: PrismaClient, authz?: AuthzService) {
    this.prisma = prisma || Prisma.init()
    this.authz = authz || new AuthzService()
  }

  create = async (username: string, universeId: string): Promise<Profile> => {
    const profile = await this.getProfile(username)
    const universe = await this.getUniverse(universeId)

    await this.authz.requirePermissions(
      [ManageSeries],
      profile.id,
      UniverseUtils.subject(universe.id)
    )

    return profile
  }

  update = async (username: string, id: string) => {
    const existing = await this.getExisting(id)
    const profile = await this.getProfile(username)

    await this.authz.requirePermissions(
      [Update],
      profile.id,
      subject(existing.id)
    )

    return existing
  }

  delete = async (username: string, id: string) => {
    const existing = await this.getExisting(id)
    const profile = await this.getProfile(username)
    const universe = await this.getUniverse(existing.universeId)

    await this.authz.requirePermissions(
      [ManageSeries],
      profile.id,
      UniverseUtils.subject(universe.id)
    )

    return existing
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
      throw new ForbiddenError('Authorization required')
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
