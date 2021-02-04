import {PrismaClient, RoleGrant} from '@prisma/client'
import {ForbiddenError} from 'apollo-server-core'
import {uniqBy} from 'lodash'

import Prisma from '../utils/Prisma'
import {Permission, Role} from './Roles'
import defaultRegistry, {RolesRegistry} from './RolesRegistry'

export interface Subject {
  table: string
  id: string
}

export default class AuthzService {
  private readonly prisma: PrismaClient
  private readonly registry: RolesRegistry

  constructor(prisma?: PrismaClient, registry?: RolesRegistry) {
    this.prisma = prisma || Prisma.init()
    this.registry = registry || defaultRegistry
  }

  /**
   * Return an array of Roles granted for the given Profile id, optionally in the context of a
   * specific subject item.
   */
  async getRolesByProfile(
    profileId: string,
    subject: Subject
  ): Promise<Role[]> {
    const grants = await this.prisma.roleGrant.findMany({
      where: {profileId, subjectId: subject.id, subjectTable: subject.table},
    })

    return grants.map(this.toRoles)
  }

  /**
   * Return an array of distinct Permissions granted via Roles for the given Profile id, optionally
   * in the context of a specific subject item.
   */
  async getPermissionsByProfile(
    profileId: string,
    subject: Subject
  ): Promise<Permission[]> {
    const roles = await this.getRolesByProfile(profileId, subject)

    const permissions = roles.reduce(
      (memo, role) => memo.concat(role.permissions),
      [] as Permission[]
    )

    return uniqBy(permissions, (permission) => permission.key)
  }

  /**
   * Check for specific Permissions and return true if they were all found for the given Profile.
   */
  async hasPermissions(
    permissions: Permission[],
    profileId: string,
    subject: Subject
  ): Promise<boolean> {
    const profilePerms = await this.getPermissionsByProfile(profileId, subject)
    const keys = profilePerms.map((permission) => permission.key)

    return permissions.every((permission) => keys.includes(permission.key))
  }

  /**
   * Check for specific Permissions and throw an error if they weren't all found for the given
   * Profile.
   */
  async requirePermissions(
    permissions: Permission[],
    profileId: string,
    subject: Subject
  ): Promise<void> {
    const success = await this.hasPermissions(permissions, profileId, subject)

    if (!success) {
      throw new ForbiddenError('Authorization required')
    }
  }

  /**
   * Map RoleGrants to Role objects.
   */
  private toRoles = (grant: RoleGrant): Role => {
    const role = this.registry.findRole(grant.roleKey)

    if (!role) {
      throw new Error(
        `Unable to find a registered Role with key ${grant.roleKey}`
      )
    }

    return role
  }
}
