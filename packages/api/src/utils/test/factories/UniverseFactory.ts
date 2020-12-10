/* eslint-disable @typescript-eslint/no-var-requires */
import {plainToClass} from 'class-transformer'
import faker from 'faker'
import {DeepPartial} from 'typeorm'

import Universe from '../../../universes/Universe.entity'
import {CreateUniverseInput} from '../../../Schema'

export const makeCreateInput = (
  overrides?: DeepPartial<CreateUniverseInput>
): CreateUniverseInput => {
  return {
    name: faker.name.findName(),
    description: faker.lorem.paragraph(),
    ownedByProfileId: faker.random.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: DeepPartial<Universe>): Universe => {
  const Profiles: typeof import('./ProfileFactory') = require('./ProfileFactory')

  const ownedByProfile = Profiles.make(overrides?.ownedByProfile)

  return plainToClass(Universe, {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    ...(ownedByProfile ? {ownedByProfile} : {}),
  })
}

export default {make, makeCreateInput}
