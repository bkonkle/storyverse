/* eslint-disable @typescript-eslint/no-var-requires */
import {plainToClass} from 'class-transformer'
import faker from 'faker'
import {DeepPartial} from 'typeorm'
import {CreateUserInput} from '../../src/Schema'

import User from '../../src/users/User.entity'

export const makeCreateInput = (
  overrides?: DeepPartial<CreateUserInput>
): CreateUserInput => {
  return {
    ...overrides,
    username: faker.random.alphaNumeric(10),
  }
}

export const make = (overrides?: DeepPartial<User>): User => {
  const Profiles: typeof import('./ProfileFactory') = require('./ProfileFactory')

  return plainToClass(User, {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    isActive: true,
    ...makeCreateInput(overrides),
    ...overrides,
    profiles: overrides?.profiles ? overrides.profiles.map(Profiles.make) : [],
  })
}

export default {make, makeCreateInput}
