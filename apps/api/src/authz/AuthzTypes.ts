import {ValueProvider, InjectionToken} from 'tsyringe'

/**
 * Permissions
 */

export interface Permission {
  key: string
  name: string
  description: string
}

export const Permission: InjectionToken<Permission> = 'AUTHZ_PERMISSION'

export type PermissionProvider = ValueProvider<Permission> & {
  token: InjectionToken<Permission>
}

export const usePermission = (permission: Permission): PermissionProvider => ({
  token: Permission,
  useValue: permission,
})

export const usePermissions = (
  permissions: Permission[]
): PermissionProvider[] => permissions.map(usePermission)

/**
 * Roles
 */
export interface Role {
  key: string
  name: string
  description: string
  permissions: Permission[]
}

export const Role: InjectionToken<Role> = 'AUTHZ_ROLE'

export type RoleProvider = ValueProvider<Role> & {token: InjectionToken<Role>}

export const useRole = (role: Role): RoleProvider => ({
  token: Role,
  useValue: role,
})

export const useRoles = (roles: Role[]): RoleProvider[] => roles.map(useRole)
