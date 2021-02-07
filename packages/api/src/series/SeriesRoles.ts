import {Permission, Role} from '../authorization/Roles'
import Registry from '../authorization/RolesRegistry'

export const Update: Permission = {
  key: 'SERIES_UPDATE',
  name: 'Update Series',
  description: 'Update details about a particular Series',
}

Registry.registerPermissions([Update])

export const Manager: Role = {
  key: 'SERIES_MANAGER',
  name: 'Series Manager',
  description: 'Able to manage a particular Series',
  permissions: [Update],
}

Registry.registerRoles([Manager])
