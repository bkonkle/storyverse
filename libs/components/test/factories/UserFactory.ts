/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateUserInput, User} from '@storyverse/graphql/api/Schema'

export const makeCreateInput = (
  overrides?: Partial<Omit<CreateUserInput, 'profile'>> | null
): Omit<CreateUserInput, 'profile'> => ({
  ...overrides,
  username: faker.random.alphaNumeric(10),
})

export const make = (overrides?: Partial<User> | null): User => ({
  id: faker.datatype.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  isActive: true,
  ...makeCreateInput(overrides),
  ...overrides,
})

export default {make, makeCreateInput}
