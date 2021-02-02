/* eslint-disable @typescript-eslint/no-var-requires */
import {plainToClass} from 'class-transformer'
import faker from 'faker'
import {DeepPartial} from 'typeorm'

import Series from '../../../series/Series.entity'
import {CreateSeriesInput} from '../../../Schema'

export const makeCreateInput = (
  overrides?: DeepPartial<CreateSeriesInput>
): CreateSeriesInput => {
  return {
    name: faker.name.findName(),
    description: faker.lorem.paragraph(),
    universeId: faker.random.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: DeepPartial<Series>): Series => {
  const Universes: typeof import('./UniverseFactory') = require('./UniverseFactory')

  const universe = Universes.make(overrides?.universe)

  return plainToClass(Series, {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    ...(universe ? {universe} : {}),
  })
}

export default {make, makeCreateInput}
