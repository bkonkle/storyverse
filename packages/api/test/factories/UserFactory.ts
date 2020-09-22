import {plainToClass} from 'class-transformer'
import faker from 'faker'

import User from '../../src/users/User.entity'

export const make = (overrides?: User): User =>
  plainToClass(User, {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    username: faker.random.alphaNumeric(10),
    isActive: true,
    profiles: [],
    ...overrides,
  })

export default {make}
