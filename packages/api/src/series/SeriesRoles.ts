import {Permission, Role} from '../authorization/Roles'

export const Update: Permission = {
  key: 'SERIES_UPDATE',
  name: 'Update Series',
  description: 'Update details about a particular Series',
}

export const Manager: Role = {
  key: 'SERIES_MANAGER',
  name: 'Series Manager',
  description: 'Able to manage a particular Series',
  permissions: [Update],
}

export const permissions = [Update]

export const roles = [Manager]

export default {roles, permissions}
