import Registry, {Permission, Role} from '../authz/RolesRegistry'

export const Update: Permission = {
  key: 'SERIES_UPDATE',
  name: 'Update Series',
  description: 'Update details about a particular Series',
}

export const ManageStories: Permission = {
  key: 'SERIES_MANAGE_STORIES',
  name: 'Manage Series Stories',
  description: 'Create, update, or delete a Story for particular Series',
}

export const ManageRoles: Permission = {
  key: 'SERIES_MANAGE_ROLES',
  name: 'Manage Series Roles',
  description: 'Grant or revoke User Roles for a particular Series',
}

Registry.registerPermissions([Update, ManageStories])

export const Manager: Role = {
  key: 'SERIES_MANAGER',
  name: 'Series Manager',
  description:
    'Able to manage Stories, update details, and manage Roles for a particular Series',
  permissions: [Update, ManageStories, ManageRoles],
}

Registry.registerRoles([Manager])
