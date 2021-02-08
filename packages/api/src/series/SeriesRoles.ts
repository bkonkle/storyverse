import Registry from '../authorization/RolesRegistry'
import {Permission, Role} from '../authorization/Roles'

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

Registry.registerPermissions([Update, ManageStories])

export const Manager: Role = {
  key: 'SERIES_MANAGER',
  name: 'Series Manager',
  description:
    'Able to manage Stories, and update details for a particular Series',
  permissions: [Update, ManageStories],
}

Registry.registerRoles([Manager])
