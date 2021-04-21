/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateProfileInput, Profile} from '@storyverse/shared/data/Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateProfileInput> | null
): CreateProfileInput => {
  return {
    email: faker.internet.email(),
    displayName: faker.name.findName(),
    picture: faker.internet.avatar(),
    userId: faker.random.uuid(),
    ...overrides,
  }
}

export const make = (overrides?: Partial<Profile> | null): Profile => {
  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides as Partial<CreateProfileInput>),
    ...overrides,
  }
}

export default {make, makeCreateInput}
