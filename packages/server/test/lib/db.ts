import snake from 'snakecase-keys'
import {pipe, pick, omit} from 'ramda'
import {knex as Knex} from '@graft/knex'

import config from '../../knexfile'

const TABLES = ['users', 'profiles', 'universes', 'universe_moderators']

export const getDb = <Record, Result>(
  extra: Partial<Knex.Config> = {}
): Knex<Record, Result> => Knex({...config, ...extra})

export const dbCleaner = async <Record, Result>(
  tables = TABLES,
  knex?: Knex<Record, Result>
): Promise<void> => {
  const db = knex || getDb()

  await Promise.all(
    tables.map(table => db.raw(`TRUNCATE TABLE "${table}" CASCADE;`))
  )
}

export const pickDb = <T>(keys: string[], t: T) => pipe(pick(keys), snake)(t)

export const omitDb = <T>(keys: string[], t: T) => pipe(omit(keys), snake)(t)
