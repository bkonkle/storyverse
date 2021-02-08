import {PrismaClient, Profile} from '@prisma/client'
import {ForbiddenError, UserInputError} from 'apollo-server-core'

import Prisma from '../utils/Prisma'
import {NotFoundError} from '../utils/Errors'
import AuthzService from '../authz/AuthzService'
import {isOwner, getSubject} from './UniverseUtils'
import {Update, Delete, ManageRoles} from './UniverseRoles'
import {Permission} from '../authz/RolesRegistry'
import {UniverseRoles} from '../Schema'

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
    const ownerProfile = await this.getProfile({profileId: ownerProfileId})

    if (!ownerProfile) {
      throw new UserInputError('The specified owner `Profile` was not found.')
    }

    if (username !== ownerProfile.user.username) {
      throw new ForbiddenError('Authorization required')
    }

    return ownerProfile
  }

  update = (username: string, id: string) =>
    this.requirePermissions(username, id, [Update])

  delete = (username: string, id: string) =>
    this.requirePermissions(username, id, [Delete])

  /**
   * Authorize the ability to grant Roles
   */
  grant = async (username: string, id: string): Promise<void> => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return
    }

    const profile = await this.getProfile({username})

    await this.authz.requirePermissions(profile.id, getSubject(existing.id), [
      ManageRoles,
    ])
  }

  /**
   * Grant Roles to a particular Profile
   */
  grantRoles = async (
    username: string,
    universeId: string,
    profileId: string,
    roles: UniverseRoles[]
  ) => {
    await this.grant(username, universeId)
    const subject = getSubject(universeId)

    await this.authz.grantRoles(profileId, subject, roles)
  }

  private requirePermissions = async (
    username: string,
    id: string,
    permissions: Permission[]
  ) => {
    const existing = await this.getExisting(id)

    if (isOwner(existing, username)) {
      return existing
    }

    const profile = await this.getProfile({username})

    await this.authz.requirePermissions(
      profile.id,
      getSubject(existing.id),
      permissions
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

  private getProfile = async (criteria: {
    username?: string
    profileId?: string
  }) => {
    const {username, profileId} = criteria
    if (!username && !profileId) {
      throw new Error('A username or profileId must be provided.')
    }

    const where = username ? {user: {username}} : {id: profileId}

    const profile = await this.prisma.profile.findFirst({
      include: {user: true},
      where,
    })
    if (!profile) {
      throw new NotFoundError('Profile not found')
    }

    return profile
  }
}
