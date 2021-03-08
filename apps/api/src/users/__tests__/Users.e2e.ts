import {Prisma} from '@prisma/client'

import App from '../../App'
import OAuth2 from '../../../test/OAuth2'
import GraphQL from '../../../test/GraphQL'
import Validation from '../../../test/Validation'
import {dbCleaner} from '../../../test/Prisma'
import UserFactory from '../../../test/factories/UserFactory'
import {Mutation, Query} from '../../Schema'
import TestData from '../../../test/TestData'
import PrismaUtils from '../../utils/Prisma'

describe('Users', () => {
  let graphql: GraphQL

  const {credentials} = OAuth2.init()
  const prisma = PrismaUtils.init()

  const tables = ['User']

  const createUser = (
    input: Omit<Prisma.UserCreateInput, 'username'>
  ) => () => {
    if (!credentials.username) {
      fail('No username found')
    }

    return prisma.user.upsert({
      where: {username: credentials.username},
      create: {
        ...input,
        username: credentials.username,
      },
      update: {
        ...input,
        username: credentials.username,
      },
    })
  }

  const deleteUser = async (id: string) => {
    const user = await prisma.user.findFirst({
      include: {profile: true},
      where: {id},
    })

    if (user?.profile?.id) {
      await prisma.profile.delete({where: {id: user.profile.id}})
    }

    await prisma.user.delete({where: {id}})
  }

  beforeAll(async () => {
    await dbCleaner(prisma, tables)

    const app = await App.init()

    graphql = new GraphQL(app)
  })

  afterEach(async () => {
    jest.resetAllMocks()
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
      const {token, username} = credentials
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

      const user = await prisma.user.findFirst({
        where: {
          id: data.createUser.user?.id,
        },
      })

      if (!user) {
        fail('No user created.')
      }

      expect(user).toMatchObject({
        ...expected,
        id: data.createUser.user?.id,
      })

      await prisma.user.delete({
        where: {
          id: user.id,
        },
      })
    })

    it('requires a username', async () => {
      const {token} = credentials
      const variables = {input: {}}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "username" of required type "String!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const {username} = credentials
      const variables = {input: {username}}

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
      const otherUser = UserFactory.make()

      const variables = {input: {username: otherUser.username}}

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

    const user = new TestData(createUser({isActive: true}), deleteUser)

    it('retrieves the currently authenticated user', async () => {
      const {token, username} = credentials

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
      const {token} = credentials

      await user.delete()

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
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })
  })

  describe('Mutation: getOrCreateCurrentUser', () => {
    const mutation = `
      mutation GetOrCreateCurrentUser($input: CreateUserInput!) {
        getOrCreateCurrentUser(input: $input) {
          user {
            id
            username
            isActive
            profile {
              id
              email
            }
          }
        }
      }
    `

    const email = 'test-email'
    const user = new TestData(
      createUser({isActive: true, profile: {create: {email}}}),
      deleteUser
    )

    it('retrieves the currently authenticated user', async () => {
      const {token, username} = credentials
      const variables = {input: {username, profile: {email}}}

      const {data} = await graphql.mutation<
        Pick<Mutation, 'getOrCreateCurrentUser'>
      >(mutation, variables, {token})

      expect(data.getOrCreateCurrentUser.user).toEqual({
        id: user.id,
        username,
        isActive: true,
        profile: {
          id: expect.any(String),
          email,
        },
      })
    })

    it('uses the input to create one when no user is found', async () => {
      const {token, username} = credentials
      const variables = {input: {username, profile: {email}}}

      const expected = {
        id: expect.stringMatching(Validation.uuidRegex),
        username,
        isActive: true,
      }

      await user.delete()

      const {data} = await graphql.mutation<
        Pick<Mutation, 'getOrCreateCurrentUser'>
      >(mutation, variables, {token})

      expect(data.getOrCreateCurrentUser).toHaveProperty(
        'user',
        expect.objectContaining(expected)
      )

      const created = await prisma.user.findFirst({
        where: {
          id: data.getOrCreateCurrentUser.user?.id,
        },
      })

      if (!created) {
        fail('No user created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.getOrCreateCurrentUser.user?.id,
      })

      await prisma.user.delete({
        where: {
          id: created.id,
        },
      })
    })

    it('requires a username', async () => {
      const {token} = credentials
      const variables = {input: {profile: {email}}}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "username" of required type "String!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const {username} = credentials
      const variables = {input: {username, profile: {email}}}

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
      const otherUser = UserFactory.make()

      const variables = {
        input: {username: otherUser.username, profile: {email}},
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

    const user = new TestData(createUser({isActive: true}), deleteUser)

    it('updates the currently authenticated user', async () => {
      const {token, username} = credentials
      const variables = {
        input: {isActive: false},
      }

      const expected = {
        id: user.id,
        username,
        isActive: false,
      }

      user.resetAfter()

      const {data} = await graphql.mutation<
        Pick<Mutation, 'updateCurrentUser'>
      >(mutation, variables, {token})

      expect(data.updateCurrentUser).toHaveProperty(
        'user',
        expect.objectContaining(expected)
      )

      const updated = await prisma.user.findFirst({
        where: {id: data.updateCurrentUser.user?.id},
      })
      expect(updated).toMatchObject(expected)
    })

    it('requires authentication', async () => {
      const variables = {
        input: {isActive: false},
      }

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('returns an error if no user is found', async () => {
      const {token} = credentials
      const variables = {
        input: {isActive: false},
      }

      await user.delete()

      const body = await graphql.mutation<Pick<Mutation, 'updateCurrentUser'>>(
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
  })
})
