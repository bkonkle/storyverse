/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateUniverseInput, Universe} from '@storyverse/graphql/Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateUniverseInput> | null
): CreateUniverseInput => ({
  name: faker.name.findName(),
  description: {text: faker.lorem.paragraph()},
  ownerProfileId: faker.datatype.uuid(),
  ...overrides,
})

export const make = (overrides?: Partial<Universe> | null): Universe => ({
  id: faker.datatype.uuid(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
  ...makeCreateInput(overrides),
  ...overrides,
})

export default {make, makeCreateInput}
