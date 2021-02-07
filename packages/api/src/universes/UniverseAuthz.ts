import {PrismaClient, Profile} from '@prisma/client'
import {ForbiddenError, UserInputError} from 'apollo-server-core'

import Prisma from '../utils/Prisma'
import {NotFoundError} from '../utils/Errors'
import AuthzService from '../authorization/AuthzService'
import {isOwner, subject} from './UniverseUtils'
import {Update, Delete} from './UniverseRoles'
import {Permission} from '../authorization/Roles'

export default class UniverseAuthz {
  private readonly prisma: PrismaClient
  private readonly authz: AuthzService

  constructor(prisma?: PrismaClient, authz?: AuthzService) {
    this.prisma = prisma || Prisma.init()
    this.authz = authz || new AuthzService()
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

  update = (username: string, id: string) =>
    this.requirePermissions(username, id, [Update])

  delete = (username: string, id: string) =>
    this.requirePermissions(username, id, [Delete])

  private requirePermissions = async (
    username: string,
    id: string,
    permissions: Permission[]
  ) => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    const profile = await this.getProfile(username)

    await this.authz.requirePermissions(
      permissions,
      profile.id,
      subject(existing.id)
    )

    return existing
  }

  private getExisting = async (id: string) => {
    const existing = await this.prisma.universe.findFirst({
      include: {ownerProfile: {include: {user: true}}},
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
}
