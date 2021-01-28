/* eslint-disable @typescript-eslint/no-var-requires */
import {plainToClass} from 'class-transformer'
import faker from 'faker'
import {DeepPartial} from 'typeorm'

import RoleGrant from '../../../authorization/RoleGrant.entity'
import {CreateRoleGrantInput} from '../../../Schema'

export const makeRoleGrantInput = (
  overrides?: DeepPartial<CreateRoleGrantInput>
): CreateRoleGrantInput => {
  return {
    ...overrides,
    roleKey: 'ROLE_KEY',
    profileId: faker.random.uuid(),
    subjectTable: faker.random.alphaNumeric(10),
    subjectId: faker.random.uuid(),
  }
}

export const make = (overrides?: DeepPartial<RoleGrant>): RoleGrant => {
  return plainToClass(RoleGrant, {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    isActive: true,
    ...makeRoleGrantInput(overrides),
    ...overrides,
  })
}

export default {make, makeRoleGrantInput}
