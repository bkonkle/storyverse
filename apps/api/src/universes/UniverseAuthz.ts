import {PrismaClient, Profile} from '@prisma/client'
import {ForbiddenError, UserInputError} from 'apollo-server-core'
import {injectable} from 'tsyringe'

import {UniverseRoles} from '@storyverse/graphql/api/Schema'
import {NotFoundError} from '@storyverse/api/utils'

import {AuthzService, Permission} from '../authz'
import {isOwner, getSubject} from './UniverseUtils'
import {Update, Delete, ManageRoles} from './UniverseRoles'

@injectable()
export default class UniverseAuthz {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly authz: AuthzService
  ) {}

  create = async (
    username: string,
    ownerProfileId: string
  ): Promise<Profile> => {
    const ownerProfile = await this.getProfile({profileId: ownerProfileId})

    if (!ownerProfile) {
      throw new UserInputError('The specified owner `Profile` was not found.')
    }

    if (username !== ownerProfile.user?.username) {
      throw new ForbiddenError('Authorization required')
    }

    return ownerProfile
  }

  update = (username: string, id: string) =>
    this.requirePermissions(username, id, [Update])

  delete = (username: string, id: string) =>
    this.requirePermissions(username, id, [Delete])

  /**
   * Grant Roles to a particular Profile
   */
  grantRoles = async (
    username: string,
    universeId: string,
    profileId: string,
    roles: UniverseRoles[]
  ) => {
    const universe = await this.getExisting(universeId)
    const subject = getSubject(universe.id)

    if (!isOwner(universe, username)) {
      const profile = await this.getProfile({username})

      await this.authz.requirePermissions(profile.id, subject, [ManageRoles])
    }

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
