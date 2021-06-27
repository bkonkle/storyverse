/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker'
import {omit, pick} from 'lodash'

import {
  Mutation,
  User,
  Profile,
  CreateUniverseInput,
  Universe,
  Query,
} from '@storyverse/graphql/api/Schema'
import {Prisma} from '@storyverse/api/utils'

import App from '../../App'
import OAuth2 from '../../../test/OAuth2'
import GraphQL from '../../../test/GraphQL'
import Validation from '../../../test/Validation'
import {dbCleaner} from '../../../test/Prisma'
import ProfileFactory from '../../../test/factories/ProfileFactory'
import UniverseFactory from '../../../test/factories/UniverseFactory'
import TestData from '../../../test/TestData'
import {Admin, Manager} from '../UniverseRoles'
import {getSubject} from '../UniverseUtils'

describe('Universes', () => {
  let graphql: GraphQL

  let user: User
  let profile: Profile

  let otherUser: User
  let otherProfile: Profile

  const {altCredentials, credentials} = OAuth2.init()
  const prisma = Prisma.init()

  const tables = ['User', 'Profile', 'Universe']

  const createUniverse = (input: CreateUniverseInput) =>
    prisma.universe.create({
      include: {ownerProfile: {include: {user: true}}},
      data: input,
    })

  const deleteUniverse = (id: string) => prisma.universe.delete({where: {id}})

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
    profile = await prisma.profile.create({
      include: {
        user: true,
      },
      data: ProfileFactory.makeCreateInput({userId: user.id}),
    })
  })

  beforeAll(async () => {
    const {username} = altCredentials

    if (!username) {
      throw new Error('No username found in OAuth2 credentials')
    }

    otherUser = await prisma.user.create({data: {username, isActive: true}})
    otherProfile = await prisma.profile.create({
      include: {
        user: true,
      },
      data: ProfileFactory.makeCreateInput({userId: otherUser.id}),
    })
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  describe('Mutation: createUniverse', () => {
    const mutation = `
      mutation CreateUniverse($input: CreateUniverseInput!) {
        createUniverse(input: $input) {
          universe {
            id
            name
            description
            ownerProfileId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownerProfileId']

    it('creates a new universe', async () => {
      const {token} = credentials
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: profile.id,
      })
      const variables = {input: universe}

      const expected = pick(
        {
          ...universe,
          id: expect.stringMatching(Validation.uuidRegex),
        },
        fields
      )

      const {data} = await graphql.mutation<Pick<Mutation, 'createUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data?.createUniverse).toHaveProperty(
        'universe',
        expect.objectContaining(expected)
      )

      const created = await prisma.universe.findFirst({
        where: {
          id: data?.createUniverse?.universe?.id,
        },
      })

      if (!created) {
        fail('No universe created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createUniverse.universe?.id,
      })

      await prisma.universe.delete({
        where: {
          id: created.id,
        },
      })
    })

    it('requires a name and an ownerProfileId', async () => {
      const {token} = credentials
      const universe = omit(
        UniverseFactory.makeCreateInput({ownerProfileId: profile.id}),
        ['name', 'ownerProfileId']
      )
      const variables = {input: universe}

      const body = await graphql.mutation(mutation, variables, {
        token,
        statusCode: 400,
        warn: false,
      })

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "name" of required type "String!" was not provided.'
          ),
        }),
        expect.objectContaining({
          message: expect.stringContaining(
            'Field "ownerProfileId" of required type "ID!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: profile.id,
      })
      const variables = {input: universe}

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
      const universe = UniverseFactory.makeCreateInput({
        ownerProfileId: otherProfile.id,
      })
      const variables = {input: universe}

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

  describe('Query: getUniverse', () => {
    const query = `
      query GetUniverse($id: ID!) {
        getUniverse(id: $id) {
          id
          name
          description
          ownerProfileId
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownerProfileId']

    const universe = new TestData(
      () =>
        createUniverse(
          UniverseFactory.makeCreateInput({ownerProfileId: profile.id})
        ),
      deleteUniverse
    )

    it('retrieves an existing universe', async () => {
      const {token} = credentials
      const variables = {id: universe.id}

      const {data} = await graphql.query<Pick<Query, 'getUniverse'>>(
        query,
        variables,
        {token}
      )

      expect(data.getUniverse).toEqual(pick(universe.value, fields))
    })

    it('returns nothing when no universe is found', async () => {
      const {token} = credentials
      const variables = {id: universe.id}

      await universe.delete()

      const {data} = await graphql.query<Pick<Query, 'getUniverse'>>(
        query,
        variables,
        {token}
      )

      expect(data.getUniverse).toBeFalsy()
    })

    it('censors the profile.user for anonymous users', async () => {
      const variables = {id: universe.id}
      const expected = pick(universe.value, fields)

      const {data} = await graphql.query<Pick<Query, 'getUniverse'>>(
        query,
        variables,
        {}
      )

      expect(data.getUniverse).toEqual(expected)
    })

    it('censors the profile.user for unauthorized users', async () => {
      const {token} = altCredentials
      const variables = {id: universe.id}
      const expected = pick(universe.value, fields)

      const {data} = await graphql.query<Pick<Query, 'getUniverse'>>(
        query,
        variables,
        {token}
      )

      expect(data.getUniverse).toEqual(expected)
    })
  })

  describe('Query: getManyUniverses', () => {
    const query = `
      query GetManyUniverses(
        $where: UniverseCondition
        $orderBy: [UniversesOrderBy!]
        $pageSize: Int
        $page: Int
      ) {
        getManyUniverses(
        where: $where
        orderBy: $orderBy
        pageSize: $pageSize
        page: $page
        ) {
          data {
            id
            name
            description
            ownerProfileId
          }
          count
          total
          page
          pageCount
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownerProfileId']

    const universe = new TestData(
      () =>
        createUniverse(
          UniverseFactory.makeCreateInput({ownerProfileId: profile.id})
        ),
      deleteUniverse
    )
    const otherUniverse = new TestData(
      () =>
        createUniverse(
          UniverseFactory.makeCreateInput({ownerProfileId: otherProfile.id})
        ),
      deleteUniverse
    )

    it('queries existing universes', async () => {
      const {token} = credentials
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManyUniverses'>>(
        query,
        variables,
        {token}
      )

      expect(data.getManyUniverses).toEqual({
        data: expect.arrayContaining([
          pick(universe.value, fields),
          pick(otherUniverse.value, fields),
        ]),
        count: 2,
        page: 1,
        pageCount: 1,
        total: 2,
      })
    })
  })

  describe('Mutation: updateUniverse', () => {
    const mutation = `
      mutation UpdateUniverse($id: ID!, $input: UpdateUniverseInput!) {
        updateUniverse(id: $id, input: $input) {
          universe {
            id
            name
            description
            ownerProfileId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownerProfileId'] as const

    const universe = new TestData(
      () =>
        createUniverse(
          UniverseFactory.makeCreateInput({ownerProfileId: profile.id})
        ),
      deleteUniverse
    )

    it('updates an existing universe', async () => {
      const {token} = credentials
      const variables = {
        id: universe.id,
        input: {name: faker.random.word()},
      }

      const expected: Pick<Universe, typeof fields[number]> = {
        ...pick(universe.value!, fields),
        name: variables.input.name,
      }

      universe.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'updateUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateUniverse).toHaveProperty(
        'universe',
        expect.objectContaining(expected)
      )

      const updated = await prisma.universe.findFirst({
        where: {id: universe.id},
      })
      expect(updated).toMatchObject(expected)
    })

    it('requires authentication', async () => {
      const variables = {
        id: universe.id,
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('returns an error if no existing universe was found', async () => {
      const {token} = credentials
      const variables = {
        id: faker.datatype.uuid(),
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateUniverse'>>(
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
        id: universe.id,
        input: {name: faker.random.word()},
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

    it('allows users with the Update permission', async () => {
      const {token} = altCredentials
      const variables = {
        id: universe.id,
        input: {name: faker.random.word()},
      }
      const subject = getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: Manager.key,
          profileId: otherProfile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const expected: Pick<Universe, typeof fields[number]> = {
        ...pick(universe.value!, fields),
        name: variables.input.name,
      }

      universe.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'updateUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateUniverse).toHaveProperty(
        'universe',
        expect.objectContaining(expected)
      )

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })
  })

  describe('Mutation: deleteUniverse', () => {
    const mutation = `
      mutation DeleteUniverse($id: ID!) {
        deleteUniverse(id: $id) {
          universe {
            id
          }
        }
      }
    `

    const universe = new TestData(
      () =>
        createUniverse(
          UniverseFactory.makeCreateInput({ownerProfileId: profile.id})
        ),
      deleteUniverse
    )

    it('deletes an existing universe', async () => {
      const {token} = credentials
      const variables = {id: universe.id}

      universe.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteUniverse).toEqual({
        universe: {
          id: universe.id,
        },
      })

      const deleted = await prisma.universe.findFirst({
        where: {id: universe.id},
      })
      expect(deleted).toBeNull()
    })

    it('requires authentication', async () => {
      const variables = {id: universe.id}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('returns an error if no existing universe was found', async () => {
      const {token} = credentials
      const variables = {id: faker.datatype.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteUniverse'>>(
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
      const variables = {id: universe.id}

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

    it('allows users with the Delete permission', async () => {
      const {token} = altCredentials
      const variables = {id: universe.id}
      const subject = getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: Admin.key,
          profileId: otherProfile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      universe.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteUniverse).toEqual({
        universe: {
          id: universe.id,
        },
      })

      const deleted = await prisma.universe.findFirst({
        where: {id: universe.id},
      })
      expect(deleted).toBeNull()
    })
  })

  describe('Mutation: grantUniverseRoles', () => {
    it.todo('grants roles for a particular universe')

    it.todo('requires authentication')

    it.todo('requires authorization')
  })
})
