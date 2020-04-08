import faker from 'faker'

import {Profile} from '../../src/Schema'

export const make = (extra: object = {}): Profile => ({
  id: faker.random.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),

  userId: faker.random.uuid(),
  displayName: faker.name.findName(),
  email: faker.internet.email(),
  picture: faker.internet.avatar(),

  ...extra,
})

export default {make}
