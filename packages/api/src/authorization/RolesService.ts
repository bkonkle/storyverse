import {Injectable} from '@nestjs/common'

import * as Roles from './Roles'

/**
 * A Service to manage pluggable Roles and Permissions.
 */
@Injectable()
export class RolesService {
  permissions: Roles.Permission[] = []
  roles: Roles.Role[] = []

  /**
   * Register any base authorization system roles needed.
   */
  constructor() {
    this.registerPermissions(Roles.permissions)
    this.registerRoles(Roles.roles)
  }

  registerPermission(permission: Roles.Permission) {
    if (this.permissions.find((existing) => existing.key === permission.key)) {
      throw new Error(
        `A Permission with key ${permission.key} has already been registered.`
      )
    }

    this.permissions = [...this.permissions, permission]
  }

  registerPermissions = (permissions: Roles.Permission[]) =>
    permissions.map(this.registerPermission)

  registerRole(role: Roles.Role) {
    if (this.roles.find((existing) => existing.key === role.key)) {
      throw new Error(
        `A Role with key ${role.key} has already been registered.`
      )
    }

    this.roles = [...this.roles, role]
  }

  registerRoles = (roles: Roles.Role[]) => roles.map(this.registerRole)

  permissionKeys = () => this.permissions.map((permission) => permission.key)
  roleKeys = () => this.roles.map((role) => role.key)
}

export default RolesService
