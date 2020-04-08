import faker from 'faker'

import {User} from '../../src/Schema'

export const make = (extra: object = {}): Omit<User, 'profilesByUserId'> => ({
  id: faker.random.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),

  username: faker.random.alphaNumeric(10),
  ...extra,
})

export default {make}