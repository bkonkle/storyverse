/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateUserInput, User} from '../../Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateUserInput> | null
): CreateUserInput => {
  return {
    ...overrides,
    username: faker.random.alphaNumeric(10),
  }
}

export const make = (overrides?: Partial<User> | null): User => {
  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    isActive: true,
    ...makeCreateInput(overrides),
    ...overrides,
  }
}

export default {make, makeCreateInput}
