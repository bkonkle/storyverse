/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateSeriesInput, Series} from '@storyverse/shared/data/Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateSeriesInput> | null
): CreateSeriesInput => {
  return {
    name: faker.name.findName(),
    description: {text: faker.lorem.paragraph()},
    universeId: faker.random.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: Partial<Series> | null): Series => {
  const Universes: typeof import('./UniverseFactory') = require('./UniverseFactory')

  const universe = Universes.make(overrides?.universe)

  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    universeId: universe.id,
    universe,
  }
}

export default {make, makeCreateInput}
