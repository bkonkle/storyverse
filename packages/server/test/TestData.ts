/* eslint-disable @typescript-eslint/no-explicit-any */
import {knex as Knex} from '@graft/knex'
import {Token} from '@graft/server'
import {omitDb} from '@graft/server/test'

import {ProfileFactory, UserFactory, UniverseFactory} from './factories'

export const handleCreateUsers = (db: Knex<any, any>, token: Token) => async (
  extras: [object, object] = [undefined, undefined]
) => {
  const [extra1, extra2] = extras

  return db('users')
    .insert([
      omitDb(
        ['id', 'createdAt', 'updatedAt'],
        UserFactory.make({username: token.sub, ...extra1})
      ),
      omitDb(['id', 'createdAt', 'updatedAt'], UserFactory.make(extra2)),
    ])
    .returning('*')
}

export const handleCreateProfiles = (
  db: Knex<any, any>,
  token: Token
) => async (
  extras: [object, object] = [undefined, undefined],
  users?: [object, object]
) => {
  const [extra1, extra2] = extras
  const [user1, user2] = users || (await handleCreateUsers(db, token)())

  return db('profiles')
    .insert([
      omitDb(
        ['id', 'createdAt', 'updatedAt'],
        ProfileFactory.make({userId: user1.id, ...extra1})
      ),
      omitDb(
        ['id', 'createdAt', 'updatedAt'],
        ProfileFactory.make({userId: user2.id, ...extra2})
      ),
    ])
    .returning('*')
}

export const handleCreateUniverses = (
  db: Knex<any, any>,
  token: Token
) => async (
  extras: [object, object] = [undefined, undefined],
  profiles?: [object, object]
) => {
  const [extra1, extra2] = extras
  const [profile1, profile2] =
    profiles || (await handleCreateProfiles(db, token)())

  return db('universes')
    .insert([
      omitDb(
        ['id', 'createdAt', 'updatedAt'],
        UniverseFactory.make({ownedByProfileId: profile1.id, ...extra1})
      ),
      omitDb(
        ['id', 'createdAt', 'updatedAt'],
        UniverseFactory.make({ownedByProfileId: profile2.id, ...extra2})
      ),
    ])
    .returning('*')
}
