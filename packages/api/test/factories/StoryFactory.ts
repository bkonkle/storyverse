/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateStoryInput, Story} from '../../src/Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateStoryInput> | null
): CreateStoryInput => {
  return {
    name: faker.name.findName(),
    volume: faker.random.number(),
    issue: faker.random.number(),
    summary: {text: faker.lorem.paragraph()},
    content: {text: faker.lorem.paragraph()},
    seriesId: faker.random.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: Partial<Story> | null): Story => {
  const Series: typeof import('./SeriesFactory') = require('./SeriesFactory')

  const series = Series.make(overrides?.series)

  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    series,
  }
}

export default {make, makeCreateInput}
