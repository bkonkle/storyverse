/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {Test} from '@nestjs/testing'
import {Connection} from 'typeorm'

import {MutationResolvers} from '../src/Schema'
import {AppModule} from '../src/AppModule'
import {JwtContext} from '../src/auth/JwtTypes'
import {ProcessEnv} from '../src/config/ConfigService'
import {Validation} from '../src/lib/resolvers'
import {GraphQL, Auth0} from '../src/lib/testing'
import UserFactory from './factories/UserFactory'

describe('User', () => {
  let app: INestApplication
  let graphql: GraphQL.Test
  let db: Connection

  const {getCredentials} = Auth0.init()

  const dbCleaner = (tables = ['users']) =>
    Promise.all(
      tables.map((table) => db.query(`TRUNCATE TABLE "${table}" CASCADE;`))
    )

  const env = {
    ...process.env,
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
    const mutation = `
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
      const {token, username} = getCredentials()
      const variables = {input: {username}}

      const {data} = await graphql.mutation<
        Pick<MutationResolvers<JwtContext>, 'createUser'>
      >(mutation, variables, {token})

      expect(data?.createUser).toHaveProperty(
        'user',
        expect.objectContaining({
          id: expect.stringMatching(Validation.uuidRegex),
          username,
          isActive: true,
        })
      )
    })

    it('requires the token sub to match the username', async () => {
      const {token} = getCredentials()
      const otherUser = UserFactory.make()

      const variables = {input: {username: otherUser.username}}

      const body = await graphql.mutation(mutation, variables, {
        warn: false,
        token,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Forbidden',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 403,
              response: {
                message: 'Forbidden',
                statusCode: 403,
              },
            }),
          }),
        }),
      ])
    })
  })
})
