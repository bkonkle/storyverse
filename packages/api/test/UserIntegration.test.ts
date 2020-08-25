import {getConnection, QueryRunner} from 'typeorm'
import {uuidRegex} from 'cultivar/utils/validation'

import {init} from '../src/Server'
import {getToken, mockJwt} from './utils/Token'
import {TestGraphQL, initGraphQL} from './utils/GraphQL'
import UserFactory from './factories/UserFactory'

jest.mock('express-jwt')

describe('User Integration', () => {
  let graphql: TestGraphQL
  let db: QueryRunner

  const tables = ['users']

  const token = getToken()
  mockJwt(token)

  beforeAll(async () => {
    const app = await init()

    graphql = initGraphQL(app, token)
    db = getConnection().createQueryRunner()
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await Promise.all(
      tables.map((table) => db.query(`TRUNCATE TABLE "${table}" CASCADE;`))
    )
  })

  describe('Mutation: createUser', () => {
    it('creates a user', async () => {
      const query = `
        mutation createUser($input: CreateUserInput!) {
          createUser(input: $input) {
            user {
              id
              username
              isActive
            }
          }
        }
      `

      const variables = {input: {username: token.sub}}

      const {data} = await graphql.query(query, variables)

      expect(data?.createUser).toHaveProperty(
        'user',
        expect.objectContaining({
          id: expect.stringMatching(uuidRegex),
          username: token.sub,
          isActive: true,
        })
      )
    })

    it('requires the token sub to match the username', async () => {
      const query = `
        mutation createUser($input: CreateUserInput!) {
          createUser(input: $input) {
            user {
              id
              username
              isActive
            }
          }
        }
      `

      const {username} = UserFactory.make()

      const variables = {input: {username}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            'new row violates row-level security policy for table "users"',
        }),
      ])
    })
  })
})
