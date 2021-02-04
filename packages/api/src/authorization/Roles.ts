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

export const GrantRoles: Permission = {
  key: 'GRANT_ROLES',
  name: 'Grant Roles',
  description: 'Grant any Role to any User Profile',
}

export const RevokeRoles: Permission = {
  key: 'REVOKE_ROLES',
  name: 'Revoke Role Grants',
  description: 'Revoke any RoleGrants from any User Profile',
}

export const RoleAdmin: Role = {
  key: 'ROLE_ADMIN',
  name: 'Role Admin',
  description: 'Manage Roles for any User Profile',
  permissions: [GrantRoles, RevokeRoles],
}

export const permissions = [GrantRoles, RevokeRoles]

export const roles = [RoleAdmin]
