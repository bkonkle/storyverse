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
   * Return an array of distinct Permissions granted via Roles for the given Profile id in the
   * context of a specific subject item.
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
   * Return an array of distinct Permission keys granted via Roles for the given Profile id, in the
   * context of a specific subject item.
   */
  async getPermissionKeysByProfile(
    profileId: string,
    subject: Subject
  ): Promise<string[]> {
    const profilePerms = await this.getPermissionsByProfile(profileId, subject)

    return profilePerms.map((permission) => permission.key)
  }

  /**
   * Check for specific Permissions and return true if they were all found for the given Profile.
   */
  async hasPermissions(
    profileId: string,
    subject: Subject,
    permissions: Permission[]
  ): Promise<boolean> {
    const keys = await this.getPermissionKeysByProfile(profileId, subject)

    return permissions.every((permission) => keys.includes(permission.key))
  }

  /**
   * Check for specific Permissions and return true if any were found for the given Profile.
   */
  async anyPermission(
    profileId: string,
    subject: Subject,
    permissions: Permission[]
  ): Promise<boolean> {
    const keys = await this.getPermissionKeysByProfile(profileId, subject)

    return permissions.some((permission) => keys.includes(permission.key))
  }

  /**
   * Check for specific Permissions and throw an error if they weren't all found for the given
   * Profile.
   */
  async requirePermissions(
    profileId: string,
    subject: Subject,
    permissions: Permission[]
  ): Promise<void> {
    const success = await this.hasPermissions(profileId, subject, permissions)

    if (!success) {
      throw new ForbiddenError('Authorization required')
    }
  }

  /**
   * Check for specific Permissions and throw an error if none of them were found for the given
   * Profile.
   */
  async requireAnyPermission(
    profileId: string,
    subject: Subject,
    permissions: Permission[]
  ): Promise<void> {
    const success = await this.anyPermission(profileId, subject, permissions)

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
