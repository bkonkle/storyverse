/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {Test} from '@nestjs/testing'
import {Connection, Repository} from 'typeorm'

import {Mutation, Query} from '../../Schema'
import {AppModule} from '../../AppModule'
import {ProcessEnv} from '../../config/ConfigService'
import {Validation} from '../../lib/resolvers'
import {GraphQl, OAuth2, TypeOrm} from '../../lib/testing'
import UserFactory from '../../utils/test/factories/UserFactory'
import User from '../../users/User.entity'

describe('User', () => {
  let app: INestApplication
  let graphql: GraphQl.Test
  let db: Connection
  let users: Repository<User>
  let typeorm: TypeOrm.Utils

  const {getCredentials} = OAuth2.init()

  const env = {
    ...process.env,
  }

  const tables = ['users']

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

    graphql = GraphQl.init(app)

    db = app.get(Connection)
    typeorm = TypeOrm.init(db)
    users = db.getRepository(User)

    await typeorm.dbCleaner(tables)
  })

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  afterEach(async () => {
    await typeorm.dbCleaner(tables)
  })

  describe('Mutation: createUser', () => {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          user {
            id
            username
            isActive
          }
        }
      }
    `

    it('creates a new user', async () => {
      const {token, username} = getCredentials()
      const variables = {input: {username}}

      const expected = {
        id: expect.stringMatching(Validation.uuidRegex),
        username,
        isActive: true,
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createUser'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.createUser).toHaveProperty(
        'user',
        expect.objectContaining(expected)
      )

      const user = await users.findOne(data.createUser.user?.id)
      expect(user).toMatchObject({
        ...expected,
        id: data.createUser.user?.id,
      })
    })

    it('requires a username', async () => {
      const {token} = getCredentials()
      const variables = {input: {}}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: `Variable "$input" got invalid value {}; Field "username" of required type "String!" was not provided.`,
        }),
      ])
    })

    it('requires authentication', async () => {
      const {username} = getCredentials()
      const variables = {input: {username}}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Unauthorized',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 401,
              response: {
                message: 'Unauthorized',
                statusCode: 401,
              },
            }),
          }),
        }),
      ])
    })

    it('requires the token sub to match the username', async () => {
      const {token} = getCredentials()
      const otherUser = UserFactory.make()

      const variables = {input: {username: otherUser.username}}

      const body = await graphql.mutation(mutation, variables, {
        token,
        warn: false,
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

  describe('Query: getCurrentUser', () => {
    const query = `
      query GetCurrentUser {
        getCurrentUser {
          id
          username
          isActive
        }
      }
    `

    let user: User

    beforeEach(async () => {
      const {username} = getCredentials()

      user = await users.save({
        username,
        isActive: true,
      })
    })

    it('retrieves the currently authenticated user', async () => {
      const {token, username} = getCredentials()

      const {data} = await graphql.query<Pick<Query, 'getCurrentUser'>>(
        query,
        undefined,
        {token}
      )

      expect(data.getCurrentUser).toEqual({
        id: user.id,
        username,
        isActive: true,
      })
    })

    it('returns null when no user is found', async () => {
      const {token} = getCredentials()

      await users.delete(user.id)

      const {data} = await graphql.query<Pick<Query, 'getCurrentUser'>>(
        query,
        undefined,
        {token}
      )

      expect(data.getCurrentUser).toBeFalsy()
    })

    it('requires authentication', async () => {
      const body = await graphql.query(query, undefined, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Unauthorized',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 401,
              response: {
                message: 'Unauthorized',
                statusCode: 401,
              },
            }),
          }),
        }),
      ])
    })
  })

  describe('Query: updateCurrentUser', () => {
    const mutation = `
      mutation UpdateCurrentUser($input: UpdateUserInput!) {
        updateCurrentUser(input: $input) {
          user {
            id
            username
            isActive
          }
        }
      }
    `

    let user: User

    beforeEach(async () => {
      const {username} = getCredentials()

      user = await users.save({
        username,
        isActive: true,
      })
    })

    it('updates the currently authenticated user', async () => {
      const {token, username} = getCredentials()
      const variables = {
        input: {isActive: false},
      }

      const expected = {
        id: user.id,
        username,
        isActive: false,
      }

      const {data} = await graphql.mutation<
        Pick<Mutation, 'updateCurrentUser'>
      >(mutation, variables, {token})

      expect(data.updateCurrentUser).toHaveProperty(
        'user',
        expect.objectContaining(expected)
      )

      const updated = await users.findOne(data.updateCurrentUser.user?.id)
      expect(updated).toMatchObject(expected)
    })

    it('requires authentication', async () => {
      const variables = {
        input: {isActive: false},
      }

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Unauthorized',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 401,
              response: {
                message: 'Unauthorized',
                statusCode: 401,
              },
            }),
          }),
        }),
      ])
    })

    it('returns an error if no user is found', async () => {
      const {token} = getCredentials()
      const variables = {
        input: {isActive: false},
      }

      await users.delete(user.id)

      const body = await graphql.mutation<Pick<Mutation, 'updateCurrentUser'>>(
        mutation,
        variables,
        {token, warn: false}
      )

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Not Found',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 404,
              response: {
                message: 'Not Found',
                statusCode: 404,
              },
            }),
          }),
        }),
      ])
    })
  })
})
