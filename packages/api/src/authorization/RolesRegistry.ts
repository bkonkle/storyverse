import * as Roles from './Roles'

/**
 * A registry to manage pluggable Roles and Permissions.
 */
export class RolesRegistry {
  permissions: Record<string, Roles.Permission> = {}
  roles: Record<string, Roles.Role> = {}

  /**
   * Add a new Permission to the registry with a unique key.
   */
  registerPermission = (permission: Roles.Permission): void => {
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
  registerRole = (role: Roles.Role): void => {
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
  registerPermissions = (permissions: Roles.Permission[]): void => {
    permissions.map(this.registerPermission)
  }

  /**
   * Add many Roles to the registry at once.
   */
  registerRoles = (roles: Roles.Role[]): void => {
    roles.map(this.registerRole)
  }

  /**
   * Finds a Permission from the registry or returns nothing.
   */
  findPermission = (key: string): Roles.Permission | undefined =>
    this.permissions[key]

  /**
   * Finds a Role from the registry or returns nothing.
   */
  findRole = (key: string): Roles.Role | undefined => this.roles[key]

  /**
   * Gets a Permission from the registry, or throws an error if it does not exist.
   */
  getPermission = (key: string): Roles.Permission => {
    const permission = this.findPermission(key)

    if (!permission) {
      throw new Error(`"${key}" is not a registered Permission.`)
    }

    return permission
  }

  /**
   * Gets a Role from the registry, or throws an error if it does not exist.
   */
  getRole = (key: string): Roles.Role => {
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
    this.checkRole(key)
  }
}

// Export a Node module-scoped default registry preloaded with the built-in roles and permissions
const registry = new RolesRegistry()
registry.registerPermissions(Roles.permissions)
registry.registerRoles(Roles.roles)

export default registry
