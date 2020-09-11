/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {getConnection, QueryRunner} from 'typeorm'
import {init} from 'cultivar/express'
import {Validation} from 'cultivar/services'
import {Express, GraphQL} from 'cultivar/testing'

import {MutationResolvers} from '../src/Schema'
import {Context} from '../src/utils/Context'
import UserFactory from './factories/UserFactory'
import TestAuthn from './utils/TestAuthn'
import {getOptions} from '../src/Server'

describe('User Integration', () => {
  let graphql: GraphQL.Test
  let db: QueryRunner

  const tables = ['users']

  const token = Express.getToken()

  const auth = TestAuthn.init(token)

  const env = {}

  beforeAll(async () => {
    const options = getOptions(env)

    const app = await init({
      ...options,
      auth: {config: options.auth!.config, middleware: auth.middleware},
    })

    graphql = GraphQL.init(app, token)
    db = getConnection().createQueryRunner()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
    auth.reset()
  })

  afterEach(async () => {
    await Promise.all(
      tables.map((table) => db.query(`TRUNCATE TABLE "${table}" CASCADE;`))
    )
  })

  describe('Mutation: createUser', () => {
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

    it('creates a user', async () => {
      const variables = {input: {username: token.sub}}

      const {data} = await graphql.query<
        Pick<MutationResolvers<Context>, 'createUser'>
      >(query, variables)

      expect(data?.createUser).toHaveProperty(
        'user',
        expect.objectContaining({
          id: expect.stringMatching(Validation.uuidRegex),
          username: token.sub,
          isActive: true,
        })
      )
    })

    it('requires the token sub to match the username', async () => {
      const {username} = UserFactory.make()

      auth.setToken({
        ...token,
        sub: username,
      })

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
