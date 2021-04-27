import {PrismaClient, RoleGrant} from '@prisma/client'
import {ForbiddenError} from 'apollo-server-core'
import {uniqBy} from 'lodash'
import {injectable, injectAll} from 'tsyringe'

import {Permission, Role} from './AuthzTypes'

export interface Subject {
  table: string
  id: string
}

@injectable()
export default class AuthzService {
  private readonly roles: Record<string, Role>
  private readonly permissions: Record<string, Permission>

  constructor(
    private readonly prisma: PrismaClient,
    @injectAll(Permission) permissions: Permission[],
    @injectAll(Role) roles: Role[]
  ) {
    this.permissions = permissions.reduce(
      (memo: Record<string, Permission>, permission) => {
        if (memo[permission.key]) {
          throw new Error(
            `A Permission with key ${permission.key} has already been registered.`
          )
        }

        return {
          ...memo,
          [permission.key]: permission,
        }
      },
      {}
    )

    this.roles = roles.reduce((memo: Record<string, Role>, role) => {
      if (memo[role.key]) {
        throw new Error(
          `A Role with key ${role.key} has already been registered.`
        )
      }

      return {
        ...memo,
        [role.key]: role,
      }
    }, {})
  }

  findPermission(key: string): Permission | undefined {
    return this.permissions[key]
  }

  getPermission(key: string): Permission {
    const permission = this.findPermission(key)

    if (!permission) {
      throw new Error(`Unable to find a registered Permission with key ${key}`)
    }

    return permission
  }

  findRole(key: string): Role | undefined {
    return this.roles[key]
  }

  getRole(key: string): Role {
    const role = this.findRole(key)

    if (!role) {
      throw new Error(`Unable to find a registered Role with key ${key}`)
    }

    return role
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

    return grants.map(this.fromGrant)
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
   * Grant the given Roles to the given Profile for the given Subject. Should only be used if the
   * grantor is fully authorized.
   */
  async grantRoles(
    profileId: string,
    subject: Subject,
    roleKeys: string[]
  ): Promise<void> {
    await Promise.all(
      roleKeys.map(this.getRole).map((role) =>
        this.prisma.roleGrant.create({
          data: {
            roleKey: role.key,
            profileId,
            subjectTable: subject.table,
            subjectId: subject.id,
          },
        })
      )
    )
  }

  /**
   * Map a RoleGrants to a Role object.
   */
  private fromGrant = (grant: RoleGrant): Role => this.getRole(grant.roleKey)
}
