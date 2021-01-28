/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker'
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {Test} from '@nestjs/testing'
import {Connection, Repository} from 'typeorm'
import {omit, pick} from 'lodash'

import {Mutation, Query} from '../../Schema'
import {AppModule} from '../../AppModule'
import {ProcessEnv} from '../../config/ConfigService'
import {Validation} from '../../lib/resolvers'
import {GraphQl, OAuth2, TypeOrm} from '../../lib/testing'
import TestData from '../../utils/test/TestData'
import ProfileFactory from '../../utils/test/factories/ProfileFactory'
import Profile from '../../profiles/Profile.entity'
import User from '../../users/User.entity'

describe('Profile', () => {
  let app: INestApplication
  let graphql: GraphQl.Test
  let db: Connection
  let users: Repository<User>
  let profiles: Repository<Profile>
  let typeorm: TypeOrm.Utils
  let user: User
  let otherUser: User

  const {credentials, altCredentials} = OAuth2.init()

  const env = {
    ...process.env,
  }

  const tables = ['users', 'profiles']

  const mockCensor = (profile?: Partial<Profile>) => ({
    ...profile,
    email: null,
    userId: null,
    user: null,
  })

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
    profiles = db.getRepository(Profile)

    await typeorm.dbCleaner(tables)
  })

  beforeAll(async () => {
    jest.resetAllMocks()

    const {username} = credentials

    user = await users.save({username, isActive: true})
  })

  beforeAll(async () => {
    const {username} = altCredentials

    otherUser = await users.save({username, isActive: true})
  })

  describe('Mutation: createProfile', () => {
    const mutation = `
      mutation CreateProfile($input: CreateProfileInput!) {
        createProfile(input: $input) {
          profile {
            id
            email
            displayName
            picture
            userId
          }
        }
      }
    `

    it('creates a new user profile', async () => {
      const {token} = credentials
      const profile = omit(ProfileFactory.makeCreateInput({userId: user.id}), [
        'user',
      ])
      const variables = {input: profile}

      const expected = {
        ...profile,
        id: expect.stringMatching(Validation.uuidRegex),
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createProfile'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.createProfile).toHaveProperty(
        'profile',
        expect.objectContaining(expected)
      )

      const created = await profiles.findOne(data.createProfile.profile?.id)

      if (!created) {
        fail('No profile created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createProfile.profile?.id,
      })

      await profiles.delete(created.id)
    })

    it('requires an email address', async () => {
      const {token} = credentials
      const profile = omit(ProfileFactory.makeCreateInput({userId: user.id}), [
        'user',
        'email',
      ])
      const variables = {input: profile}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: expect.stringContaining(
            'Field email of required type String! was not provided.'
          ),
        }),
      ])
    })

    it('requires a userId or inline user input', async () => {
      const {token} = credentials
      const profile = ProfileFactory.makeCreateInput()
      const variables = {input: profile}

      const body = await graphql.mutation(mutation, variables, {
        token,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "userId" of type "String" or "user" of type "CreateUserInput" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const profile = ProfileFactory.makeCreateInput({userId: user.id})
      const variables = {input: profile}

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

    it('requires authorization', async () => {
      const {token} = credentials
      const profile = omit(
        ProfileFactory.makeCreateInput({userId: otherUser.id}),
        ['user']
      )
      const variables = {input: profile}

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

  describe('Query: getProfile', () => {
    const query = `
      query GetProfile($id: UUID!) {
        getProfile(id: $id) {
          id
          email
          displayName
          picture
          userId
          user {
            id
          }
        }
      }
    `
    const fields = [
      'id',
      'email',
      'displayName',
      'picture',
      'userId',
      'user.id',
    ]

    const profile = new TestData(
      () => profiles,
      () =>
        ProfileFactory.make({
          userId: user.id,
          user,
        })
    )

    it('retrieves an existing user profile', async () => {
      const {token} = credentials
      const variables = {id: profile.id}
      const expected = pick(profile.value, fields)

      const {data} = await graphql.query<Pick<Query, 'getProfile'>>(
        query,
        variables,
        {token}
      )

      expect(data.getProfile).toEqual(expected)
    })

    it('returns nothing when no profile is found', async () => {
      const {token} = credentials
      const variables = {id: profile.id}

      await profile.delete()

      const {data} = await graphql.query<Pick<Query, 'getProfile'>>(
        query,
        variables,
        {token}
      )

      expect(data.getProfile).toBeFalsy()
    })

    it('censors responses for anonymous users', async () => {
      const variables = {id: profile.id}
      const expected = pick(profile.value, fields)

      const {data} = await graphql.query<Pick<Query, 'getProfile'>>(
        query,
        variables,
        {}
      )

      expect(data.getProfile).toEqual(mockCensor(expected))
    })

    it('censors responses for unauthorized users', async () => {
      const {token} = altCredentials
      const variables = {id: profile.id}
      const expected = pick(profile.value, fields)

      const {data} = await graphql.query<Pick<Query, 'getProfile'>>(
        query,
        variables,
        {token}
      )

      expect(data.getProfile).toEqual(mockCensor(expected))
    })
  })

  describe('Query: getManyProfiles', () => {
    const query = `
      query GetManyProfiles(
        $where: ProfileCondition
        $orderBy: [ProfilesOrderBy!]
        $pageSize: Int
        $page: Int
      ) {
        getManyProfiles(
        where: $where
        orderBy: $orderBy
        pageSize: $pageSize
        page: $page
        ) {
          data {
            id
            email
            displayName
            picture
            userId
            user {
              id
            }
          }
          count
          total
          page
          pageCount
        }
      }
    `
    const fields = [
      'id',
      'email',
      'displayName',
      'picture',
      'userId',
      'user.id',
    ]

    const profile = new TestData(
      () => profiles,
      () =>
        ProfileFactory.make({
          userId: user.id,
          user,
        })
    )
    const otherProfile = new TestData(
      () => profiles,
      () =>
        ProfileFactory.make({
          userId: otherUser.id,
          user: otherUser,
        })
    )

    it('queries existing profiles', async () => {
      const {token} = credentials
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManyProfiles'>>(
        query,
        variables,
        {token}
      )

      expect(data.getManyProfiles).toEqual({
        data: expect.arrayContaining([
          pick(profile.value, fields),
          mockCensor(pick(otherProfile.value, fields)),
        ]),
        count: 2,
        page: 1,
        pageCount: 1,
        total: 2,
      })
    })

    it('censors responses for anonymous users', async () => {
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManyProfiles'>>(
        query,
        variables,
        {}
      )

      expect(data.getManyProfiles).toEqual({
        data: expect.arrayContaining([
          mockCensor(pick(profile.value, fields)),
          mockCensor(pick(otherProfile.value, fields)),
        ]),
        count: 2,
        page: 1,
        pageCount: 1,
        total: 2,
      })
    })

    it('censors responses for unauthorized users', async () => {
      const {token} = altCredentials
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManyProfiles'>>(
        query,
        variables,
        {token}
      )

      expect(data.getManyProfiles).toEqual({
        data: expect.arrayContaining([
          mockCensor(pick(profile.value, fields)),
          pick(otherProfile.value, fields),
        ]),
        count: 2,
        page: 1,
        pageCount: 1,
        total: 2,
      })
    })
  })

  describe('Mutation: updateProfile', () => {
    const mutation = `
      mutation UpdateProfile($id: UUID!, $input: UpdateProfileInput!) {
        updateProfile(id: $id, input: $input) {
          profile {
            id
            email
            displayName
            picture
            userId
          }
        }
      }
    `
    const fields = ['id', 'email', 'displayName', 'picture', 'userId']

    const profile = new TestData(
      () => profiles,
      () =>
        ProfileFactory.make({
          userId: user.id,
          user,
        })
    )

    it('updates an existing user profile', async () => {
      const {token} = credentials
      const variables = {
        id: profile.id,
        input: {picture: faker.internet.avatar()},
      }

      const expected = {
        ...pick(profile.value, fields),
        picture: variables.input.picture,
      }

      profile.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'updateProfile'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateProfile).toHaveProperty(
        'profile',
        expect.objectContaining(expected)
      )

      const updated = await profiles.findOne(profile.id)
      expect(updated).toMatchObject(expected)
    })

    it('requires the id to be a uuid', async () => {
      const {token} = credentials
      const variables = {
        id: 'test-id',
        input: {picture: faker.internet.avatar()},
      }

      const body = await graphql.mutation(mutation, variables, {
        token,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Validation failed (uuid  is expected)',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 400,
              response: expect.objectContaining({
                message: 'Validation failed (uuid  is expected)',
                statusCode: 400,
              }),
            }),
          }),
        }),
      ])
    })

    it('requires authentication', async () => {
      const variables = {
        id: profile.id,
        input: {picture: faker.internet.avatar()},
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

    it('returns an error if no existing profile was found', async () => {
      const {token} = credentials
      const variables = {
        id: faker.random.uuid(),
        input: {picture: faker.internet.avatar()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateProfile'>>(
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

    it('requires authorization', async () => {
      const {token} = altCredentials
      const variables = {
        id: profile.id,
        input: {picture: faker.internet.avatar()},
      }

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

  describe('Mutation: deleteProfile', () => {
    const mutation = `
        mutation DeleteProfile($id: UUID!) {
          deleteProfile(id: $id) {
            profile {
              id
            }
          }
        }
      `

    const profile = new TestData(
      () => profiles,
      () =>
        ProfileFactory.make({
          userId: user.id,
          user,
        })
    )

    it('deletes an existing user profile', async () => {
      const {token} = credentials
      const variables = {id: profile.id}

      profile.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteProfile'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteProfile).toEqual({
        profile: {
          id: profile.id,
        },
      })

      const deleted = await profiles.findOne(profile.id)
      expect(deleted).toBeUndefined()
    })

    it('requires the id to be a uuid', async () => {
      const {token} = credentials
      const variables = {id: 'test-id'}

      const body = await graphql.mutation(mutation, variables, {
        token,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Validation failed (uuid  is expected)',
          extensions: expect.objectContaining({
            exception: expect.objectContaining({
              status: 400,
              response: expect.objectContaining({
                message: 'Validation failed (uuid  is expected)',
                statusCode: 400,
              }),
            }),
          }),
        }),
      ])
    })

    it('requires authentication', async () => {
      const variables = {id: profile.id}

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

    it('returns an error if no existing profile was found', async () => {
      const {token} = credentials
      const variables = {id: faker.random.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteProfile'>>(
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

    it('requires authorization', async () => {
      const {token} = altCredentials
      const variables = {id: profile.id}

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
})
