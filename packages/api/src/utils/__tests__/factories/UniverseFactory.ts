/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateUniverseInput, Universe} from '../../../Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateUniverseInput>
): CreateUniverseInput => {
  return {
    name: faker.name.findName(),
    description: {text: faker.lorem.paragraph()},
    ownerProfileId: faker.random.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: Partial<Universe>): Universe => {
  const Profiles: typeof import('./ProfileFactory') = require('./ProfileFactory')

  const ownerProfile = Profiles.make(overrides?.ownerProfile)

  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    ownerProfile,
  }
}

export default {make, makeCreateInput}
