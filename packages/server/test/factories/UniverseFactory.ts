import faker from 'faker'

import {Universe} from '../../src/Schema'

export const make = (
  extra: object = {}
): Omit<Universe, 'universeModeratorsByUniverseId'> => ({
  id: faker.random.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),

  name: faker.name.findName(),
  description: faker.lorem.paragraphs(2),
  ownedByProfileId: faker.random.uuid(),
  ...extra,
})

export default {make}
