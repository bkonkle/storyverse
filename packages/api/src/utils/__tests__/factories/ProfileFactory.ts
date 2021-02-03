/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'

import {CreateProfileInput, Profile} from '../../../Schema'

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
  const Users: typeof import('./UserFactory') = require('./UserFactory')

  const user = Users.make(overrides?.user)

  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput({
      ...overrides,
      userId: user.id,
      email: overrides?.email || undefined,
    }),
    ...overrides,
    ...(user ? {user} : {}),
  }
}

export default {make, makeCreateInput}
