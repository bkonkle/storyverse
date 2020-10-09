/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {Test} from '@nestjs/testing'
import {Connection} from 'typeorm'

import {MutationResolvers} from '../src/Schema'
import {AppModule} from '../src/AppModule'
import {JwtContext} from '../src/auth/JwtTypes'
import {ProcessEnv, Vars} from '../src/config/ConfigService'
import {Validation} from '../src/lib/resolvers'
import {Express, GraphQL} from '../src/lib/testing'
import UserFactory from './factories/UserFactory'

describe('User', () => {
  let app: INestApplication
  let graphql: GraphQL.Test
  let db: Connection

  const dbCleaner = (tables = ['users']) =>
    Promise.all(
      tables.map((table) => db.query(`TRUNCATE TABLE "${table}" CASCADE;`))
    )

  const token = Express.makeToken()

  const env = {
    [Vars.Auth0Issuer]: 'http://localhost',
  }

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ProcessEnv)
      .useValue(env)

      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())

    await app.init()

    graphql = GraphQL.init(app)

    db = app.get(Connection)

    await dbCleaner()
  })

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  afterEach(async () => {
    await dbCleaner()
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

    it.only('creates a user', async () => {
      const variables = {input: {username: token.sub}}

      const {data} = await graphql.query<
        Pick<MutationResolvers<JwtContext>, 'createUser'>
      >(query, variables, {token})

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

      const variables = {input: {username}}

      const body = await graphql.query(query, variables, {
        warn: false,
        token: Express.makeToken(),
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            'new row violates row-level security policy for table "users"',
        }),
      ])
    })
  })
})
