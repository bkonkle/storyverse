/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateStoryInput, Story} from '@storyverse/graphql/api/Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateStoryInput> | null
): CreateStoryInput => {
  return {
    name: faker.name.findName(),
    season: faker.datatype.number(),
    issue: faker.datatype.number(),
    summary: {text: faker.lorem.paragraph()},
    content: {text: faker.lorem.paragraph()},
    seriesId: faker.datatype.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: Partial<Story> | null): Story => {
  const Series: typeof import('./SeriesFactory') = require('./SeriesFactory')

  const series = Series.make(overrides?.series)

  return {
    id: faker.datatype.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    series,
  }
}

export default {make, makeCreateInput}
