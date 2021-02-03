/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateRoleGrantInput, RoleGrant} from '../../../Schema'

export const makeRoleGrantInput = (
  overrides?: Partial<CreateRoleGrantInput> | null
): CreateRoleGrantInput => {
  return {
    ...overrides,
    roleKey: 'ROLE_KEY',
    profileId: faker.random.uuid(),
    subjectTable: faker.random.alphaNumeric(10),
    subjectId: faker.random.uuid(),
  }
}

export const make = (overrides?: Partial<RoleGrant> | null): RoleGrant => {
  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeRoleGrantInput(overrides),
    ...overrides,
  }
}

export default {make, makeRoleGrantInput}
