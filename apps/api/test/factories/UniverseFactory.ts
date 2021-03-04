/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateUniverseInput, Universe} from '../../src/Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateUniverseInput> | null
): CreateUniverseInput => ({
  name: faker.name.findName(),
  description: {text: faker.lorem.paragraph()},
  ownerProfileId: faker.random.uuid(),
  ...overrides,
})

export const make = (overrides?: Partial<Universe> | null): Universe => ({
  id: faker.random.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...makeCreateInput(overrides),
  ...overrides,
})

export default {make, makeCreateInput}
