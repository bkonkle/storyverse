/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker'
import {omit, pick} from 'lodash'

import {
  Mutation,
  Query,
  CreateProfileInput,
  Profile,
  User,
} from '@storyverse/graphql/api/Schema'
import {Prisma} from '@storyverse/api/utils'

import App from '../../App'
import OAuth2 from '../../../test/OAuth2'
import GraphQL from '../../../test/GraphQL'
import Validation from '../../../test/Validation'
import {dbCleaner} from '../../../test/Prisma'
import ProfileFactory from '../../../test/factories/ProfileFactory'
import TestData from '../../../test/TestData'

describe('Profile', () => {
  let graphql: GraphQL

  let user: User
  let otherUser: User

  const {altCredentials, credentials} = OAuth2.init()
  const prisma = Prisma.init()

  const tables = ['User', 'Profile']

  const createProfile = (input: CreateProfileInput) =>
    prisma.profile.upsert({
      include: {user: true},
      where: {userId: input.userId},
      create: input,
      update: input,
    })

  const deleteProfile = (id: string) => prisma.profile.delete({where: {id}})

  const mockCensor = (profile?: Partial<Profile>) => ({
    ...profile,
    email: null,
    userId: null,
  })

  beforeAll(async () => {
    await dbCleaner(prisma, tables)

    const app = App.create()

    graphql = new GraphQL(await app.init())
  })

  beforeAll(async () => {
    const {username} = credentials

    if (!username) {
      throw new Error('No username found in OAuth2 credentials')
    }

    user = await prisma.user.create({data: {username, isActive: true}})
  })

  beforeAll(async () => {
    const {username} = altCredentials

    if (!username) {
      throw new Error('No username found in OAuth2 credentials')
    }

    otherUser = await prisma.user.create({data: {username, isActive: true}})
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

      const created = await prisma.profile.findFirst({
        where: {id: data.createProfile.profile?.id},
      })

      if (!created) {
        fail('No profile created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createProfile.profile?.id,
      })

      await prisma.profile.delete({
        where: {id: created.id},
      })
    })

    it('requires an email address and a userId', async () => {
      const {token} = credentials
      const profile = omit(ProfileFactory.makeCreateInput(), [
        'userId',
        'email',
      ])
      const variables = {input: profile}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty(
        'errors',
        expect.arrayContaining([
          expect.objectContaining({
            message: expect.stringContaining(
              'Field "email" of required type "String!" was not provided.'
            ),
          }),
          expect.objectContaining({
            message: expect.stringContaining(
              'Field "userId" of required type "String!" was not provided.'
            ),
          }),
        ])
      )
    })

    it('requires authentication', async () => {
      const profile = ProfileFactory.makeCreateInput({userId: user.id})
      const variables = {input: profile}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
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
          message: 'Authorization required',
          extensions: {code: 'FORBIDDEN'},
        }),
      ])
    })
  })

  describe('Query: getProfile', () => {
    const query = `
      query GetProfile($id: ID!) {
        getProfile(id: $id) {
          id
          email
          displayName
          picture
          userId
        }
      }
    `
    const fields = ['id', 'email', 'displayName', 'picture', 'userId']

    const profile = new TestData(
      () => createProfile(ProfileFactory.makeCreateInput({userId: user.id})),
      deleteProfile
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
          }
          count
          total
          page
          pageCount
        }
      }
    `
    const fields = ['id', 'email', 'displayName', 'picture', 'userId']

    const profile = new TestData(
      () =>
        createProfile(
          ProfileFactory.makeCreateInput({
            userId: user.id,
          })
        ),
      deleteProfile
    )
    const otherProfile = new TestData(
      () =>
        createProfile(
          ProfileFactory.makeCreateInput({
            userId: otherUser.id,
          })
        ),
      deleteProfile
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
      mutation UpdateProfile($id: ID!, $input: UpdateProfileInput!) {
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
      () =>
        createProfile(
          ProfileFactory.makeCreateInput({
            userId: user.id,
          })
        ),
      deleteProfile
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

      const updated = await prisma.profile.findFirst({
        where: {id: profile.id},
      })
      expect(updated).toMatchObject(expected)
    })

    it('requires authentication', async () => {
      const variables = {
        id: profile.id,
        input: {picture: faker.internet.avatar()},
      }

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('returns an error if no existing profile was found', async () => {
      const {token} = credentials
      const variables = {
        id: faker.datatype.uuid(),
        input: {picture: faker.internet.avatar()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateProfile'>>(
        mutation,
        variables,
        {token, warn: false}
      )

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Not found',
          extensions: {code: 'NOT_FOUND'},
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
          message: 'Authorization required',
          extensions: {code: 'FORBIDDEN'},
        }),
      ])
    })
  })

  describe('Mutation: deleteProfile', () => {
    const mutation = `
        mutation DeleteProfile($id: ID!) {
          deleteProfile(id: $id) {
            profile {
              id
            }
          }
        }
      `

    const profile = new TestData(
      () =>
        createProfile(
          ProfileFactory.makeCreateInput({
            userId: user.id,
          })
        ),
      deleteProfile
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

      const deleted = await prisma.profile.findFirst({
        where: {id: profile.id},
      })
      expect(deleted).toBeNull()
    })

    it('requires authentication', async () => {
      const variables = {id: profile.id}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('returns an error if no existing profile was found', async () => {
      const {token} = credentials
      const variables = {id: faker.datatype.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteProfile'>>(
        mutation,
        variables,
        {token, warn: false}
      )

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Not found',
          extensions: {code: 'NOT_FOUND'},
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
          message: 'Authorization required',
          extensions: {code: 'FORBIDDEN'},
        }),
      ])
    })
  })
})
