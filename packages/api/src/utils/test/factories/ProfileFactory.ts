/* eslint-disable @typescript-eslint/no-var-requires */
import {plainToClass} from 'class-transformer'
import faker from 'faker'
import {DeepPartial} from 'typeorm'

import Profile from '../../../profiles/Profile.entity'
import {CreateProfileInput} from '../../../Schema'

export const makeCreateInput = (
  overrides?: DeepPartial<CreateProfileInput>
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

export const make = (overrides?: DeepPartial<Profile>): Profile => {
  const Users: typeof import('./UserFactory') = require('./UserFactory')

  const user = Users.make(overrides?.user)

  return plainToClass(Profile, {
    id: faker.random.uuid(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    ...makeCreateInput(overrides),
    ...overrides,
    ...(user ? {user} : {}),
  })
}

export default {make, makeCreateInput}
