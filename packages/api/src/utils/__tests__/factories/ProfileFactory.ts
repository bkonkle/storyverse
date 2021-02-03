/* eslint-disable @typescript-eslint/no-var-requires */
import faker from 'faker'
import {omit} from 'lodash'

import {CreateProfileInput, Profile} from '../../../Schema'

export const makeCreateInput = (
  overrides?: Partial<CreateProfileInput>
): CreateProfileInput => {
  const Users: typeof import('./UserFactory') = require('./UserFactory')

  const user = overrides?.user && Users.makeCreateInput(overrides.user)

  return {
    email: faker.internet.email(),
    displayName: faker.name.findName(),
    picture: faker.internet.avatar(),
    ...overrides,
    user,
  }
}

export const make = (overrides?: Partial<Profile>): Profile => {
  const Users: typeof import('./UserFactory') = require('./UserFactory')

  const user = Users.make(overrides?.user)

  return {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...omit(makeCreateInput(overrides), ['user']),
    ...overrides,
    ...(user ? {user} : {}),
  }
}

export default {make, makeCreateInput}
