import Registry from '../authz/RolesRegistry'
import {Permission, Role} from '../authz/Roles'

export const Update: Permission = {
  key: 'UNIVERSE_UPDATE',
  name: 'Update Universe',
  description: 'Update details about a particular Universe',
}

export const Delete: Permission = {
  key: 'UNIVERSE_DELETE',
  name: 'Manage Universe',
  description: 'Delete a particular Universe',
}

export const ManageSeries: Permission = {
  key: 'UNIVERSE_MANAGE_SERIES',
  name: 'Manage Universe Series',
  description: 'Create, update, or delete a Series for particular Universe',
}

export const ManageRoles: Permission = {
  key: 'UNIVERSE_MANAGE_ROLES',
  name: 'Manage Universe Roles',
  description: 'Grant or revoke User Roles for a particular Universe',
}

Registry.registerPermissions([Update, Delete, ManageSeries, ManageRoles])

export const Manager: Role = {
  key: 'UNIVERSE_MANAGER',
  name: 'Universe Manager',
  description:
    'Able to manage Series and update details for a particular Universe',
  permissions: [Update, ManageSeries],
}

export const Admin: Role = {
  key: 'UNIVERSE_ADMIN',
  name: 'Universe Admin',
  description: 'Able to fully control a particular Universe',
  permissions: [...Manager.permissions, Delete, ManageRoles],
}

Registry.registerRoles([Manager, Admin])
