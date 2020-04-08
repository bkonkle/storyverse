// import {pick} from 'ramda'
import {
  GraphQL,
  dbCleaner,
  getDb,
  getToken,
  initGraphQL,
  mockJwt,
} from '@graft/server/test'

import config from '../knexfile'
import {TABLES, init} from './TestApp'

jest.mock('express-jwt')

describe('Universe Moderator Integration', () => {
  let _graphql: GraphQL

  const token = getToken()
  mockJwt(token)

  const db = getDb(config)

  beforeAll(async () => {
    const {app} = await init()
    _graphql = initGraphQL(app, token)
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await dbCleaner(db, TABLES)
  })
})
