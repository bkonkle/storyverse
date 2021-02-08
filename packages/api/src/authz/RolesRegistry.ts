export interface Permission {
  key: string
  name: string
  description: string
}

export interface Role {
  key: string
  name: string
  description: string
  permissions: Permission[]
}

/**
 * A registry to manage pluggable Roles and Permissions.
 */
export class RolesRegistry {
  permissions: Record<string, Permission> = {}
  roles: Record<string, Role> = {}

  /**
   * Add a new Permission to the registry with a unique key.
   */
  registerPermission = (permission: Permission): void => {
    if (this.permissions[permission.key]) {
      throw new Error(
        `A Permission with key ${permission.key} has already been registered.`
      )
    }

    this.permissions[permission.key] = permission
  }

  /**
   * Add a new Role to the registry with a unique key.
   */
  registerRole = (role: Role): void => {
    if (this.roles[role.key]) {
      throw new Error(
        `A Role with key ${role.key} has already been registered.`
      )
    }

    this.roles[role.key] = role
  }

  /**
   * Add many Permissions to the registry at once.
   */
  registerPermissions = (permissions: Permission[]): void => {
    permissions.map(this.registerPermission)
  }

  /**
   * Add many Roles to the registry at once.
   */
  registerRoles = (roles: Role[]): void => {
    roles.map(this.registerRole)
  }

  /**
   * Finds a Permission from the registry or returns nothing.
   */
  findPermission = (key: string): Permission | undefined =>
    this.permissions[key]

  /**
   * Finds a Role from the registry or returns nothing.
   */
  findRole = (key: string): Role | undefined => this.roles[key]

  /**
   * Gets a Permission from the registry, or throws an error if it does not exist.
   */
  getPermission = (key: string): Permission => {
    const permission = this.findPermission(key)

    if (!permission) {
      throw new Error(`"${key}" is not a registered Permission.`)
    }

    return permission
  }

  /**
   * Gets a Role from the registry, or throws an error if it does not exist.
   */
  getRole = (key: string): Role => {
    const role = this.findRole(key)

    if (!role) {
      throw new Error(`"${key}" is not a registered Role.`)
    }

    return role
  }

  /**
   * Throws an error if the given Permission key does not exist in the registry.
   */
  checkPermission = (key: string): void => {
    this.getPermission(key)
  }

  /**
   * Throws an error if the given Role key does not exist in the registry.
   */
  checkRole = (key: string): void => {
    this.getRole(key)
  }
}

// Export a default registry held in Node module scope as a singleton
const registry = new RolesRegistry()
export default registry
