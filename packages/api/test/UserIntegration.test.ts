import {getConnection, QueryRunner} from 'typeorm'

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
            }
          }
        }
      `

      const user = UserFactory.make({username: token.sub})

      const variables = {input: {user}}

      const {data} = await graphql.query(query, variables)

      expect(data?.createUser).toHaveProperty(
        'user',
        expect.objectContaining({username: user.username})
      )
    })
  })
})
