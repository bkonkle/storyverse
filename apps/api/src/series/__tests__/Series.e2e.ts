/* eslint-disable @typescript-eslint/no-non-null-assertion */
import faker from 'faker'
import {omit, pick} from 'lodash'

import {
  Mutation,
  User,
  Profile,
  CreateSeriesInput,
  Series,
  Query,
  Universe,
} from '@storyverse/graphql/api/Schema'

import App from '../../App'
import OAuth2 from '../../../test/OAuth2'
import GraphQL from '../../../test/GraphQL'
import Validation from '../../../test/Validation'
import {dbCleaner} from '../../../test/Prisma'
import ProfileFactory from '../../../test/factories/ProfileFactory'
import SeriesFactory from '../../../test/factories/SeriesFactory'
import Prisma from '../../utils/Prisma'
import TestData from '../../../test/TestData'
import UniverseFactory from '../../../test/factories/UniverseFactory'
import * as UniverseRoles from '../../universes/UniverseRoles'
import * as UniverseUtils from '../../universes/UniverseUtils'
import {Manager} from '../SeriesRoles'
import {getSubject} from '../SeriesUtils'

describe('Series', () => {
  let graphql: GraphQL

  let user: User
  let profile: Profile
  let universe: Universe

  let otherUser: User
  let otherProfile: Profile
  let otherUniverse: Universe

  const {altCredentials, credentials} = OAuth2.init()
  const prisma = Prisma.init()

  const tables = ['User', 'Profile', 'Series']

  const createSeries = (input: CreateSeriesInput) =>
    prisma.series.create({
      include: {universe: {include: {ownerProfile: {include: {user: true}}}}},
      data: input,
    })

  const deleteSeries = (id: string) => prisma.series.delete({where: {id}})

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
      include: {user: true},
      data: ProfileFactory.makeCreateInput({userId: user.id}),
    })
    universe = await prisma.universe.create({
      include: {ownerProfile: {include: {user: true}}},
      data: UniverseFactory.makeCreateInput({ownerProfileId: profile.id}),
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
    otherUniverse = await prisma.universe.create({
      include: {ownerProfile: {include: {user: true}}},
      data: UniverseFactory.makeCreateInput({ownerProfileId: otherProfile.id}),
    })
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  describe('Mutation: createSeries', () => {
    const mutation = `
      mutation CreateSeries($input: CreateSeriesInput!) {
        createSeries(input: $input) {
          series {
            id
            name
            description
            universeId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'universeId']

    it('creates a new series', async () => {
      const {token} = credentials
      const series = SeriesFactory.makeCreateInput({
        universeId: universe.id,
      })
      const variables = {input: series}

      const expected = pick(
        {
          ...series,
          id: expect.stringMatching(Validation.uuidRegex),
        },
        fields
      )

      const subject = UniverseUtils.getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: UniverseRoles.Manager.key,
          profileId: profile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data?.createSeries).toHaveProperty(
        'series',
        expect.objectContaining(expected)
      )

      const created = await prisma.series.findFirst({
        where: {
          id: data?.createSeries?.series?.id,
        },
      })

      if (!created) {
        fail('No series created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createSeries.series?.id,
      })

      await prisma.series.delete({
        where: {
          id: created.id,
        },
      })
      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })

    it('requires a name and a universeId', async () => {
      const {token} = credentials
      const series = omit(
        SeriesFactory.makeCreateInput({universeId: universe.id}),
        ['name', 'universeId']
      )
      const variables = {input: series}

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
            'Field "universeId" of required type "ID!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const series = SeriesFactory.makeCreateInput({
        universeId: universe.id,
      })
      const variables = {input: series}

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
      const series = SeriesFactory.makeCreateInput({
        universeId: otherUniverse.id,
      })
      const variables = {input: series}

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

  describe('Query: getSeries', () => {
    const query = `
      query GetSeries($id: ID!) {
        getSeries(id: $id) {
          id
          name
          description
          universeId
        }
      }
    `
    const fields = ['id', 'name', 'description', 'universeId']

    const series = new TestData(
      () =>
        createSeries(SeriesFactory.makeCreateInput({universeId: universe.id})),
      deleteSeries
    )

    it('retrieves an existing series', async () => {
      const {token} = credentials
      const variables = {id: series.id}

      const {data} = await graphql.query<Pick<Query, 'getSeries'>>(
        query,
        variables,
        {token}
      )

      expect(data.getSeries).toEqual(pick(series.value, fields))
    })

    it('returns nothing when no series is found', async () => {
      const {token} = credentials
      const variables = {id: series.id}

      await series.delete()

      const {data} = await graphql.query<Pick<Query, 'getSeries'>>(
        query,
        variables,
        {token}
      )

      expect(data.getSeries).toBeFalsy()
    })
  })

  describe('Query: getManySeries', () => {
    const query = `
      query GetManySeries(
        $where: SeriesCondition
        $orderBy: [SeriesOrderBy!]
        $pageSize: Int
        $page: Int
      ) {
        getManySeries(
        where: $where
        orderBy: $orderBy
        pageSize: $pageSize
        page: $page
        ) {
          data {
            id
            name
            description
            universe {
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
    const fields = ['id', 'name', 'description', 'universe.id']

    const series = new TestData(
      () =>
        createSeries(SeriesFactory.makeCreateInput({universeId: universe.id})),
      deleteSeries
    )
    const otherSeries = new TestData(
      () =>
        createSeries(
          SeriesFactory.makeCreateInput({universeId: otherUniverse.id})
        ),
      deleteSeries
    )

    it('queries existing series', async () => {
      const {token} = credentials
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManySeries'>>(
        query,
        variables,
        {token}
      )

      expect(data.getManySeries).toEqual({
        data: expect.arrayContaining([
          pick(series.value, fields),
          pick(otherSeries.value, fields),
        ]),
        count: 2,
        page: 1,
        pageCount: 1,
        total: 2,
      })
    })
  })

  describe('Mutation: updateSeries', () => {
    const mutation = `
      mutation UpdateSeries($id: ID!, $input: UpdateSeriesInput!) {
        updateSeries(id: $id, input: $input) {
          series {
            id
            name
            description
            universeId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'universeId'] as const

    const series = new TestData(
      () =>
        createSeries(SeriesFactory.makeCreateInput({universeId: universe.id})),
      deleteSeries
    )

    it('updates an existing series', async () => {
      const {token} = credentials
      const variables = {
        id: series.id,
        input: {name: faker.random.word()},
      }

      const expected: Pick<Series, typeof fields[number]> = {
        ...pick(series.value!, fields),
        name: variables.input.name,
      }

      series.resetAfter()

      const subject = getSubject(series.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: Manager.key,
          profileId: profile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'updateSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateSeries).toHaveProperty(
        'series',
        expect.objectContaining(expected)
      )

      const updated = await prisma.series.findFirst({
        where: {id: series.id},
      })
      expect(updated).toMatchObject(expected)

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })

    it('returns an error if no existing series was found', async () => {
      const {token} = credentials
      const variables = {
        id: faker.datatype.uuid(),
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateSeries'>>(
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

    it('requires authentication', async () => {
      const variables = {
        id: series.id,
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

    it('requires authorization', async () => {
      const {token} = altCredentials
      const variables = {
        id: series.id,
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

    it('allows users with the ManageSeries permission', async () => {
      const {token} = altCredentials
      const variables = {
        id: series.id,
        input: {name: faker.random.word()},
      }

      const expected: Pick<Series, typeof fields[number]> = {
        ...pick(series.value!, fields),
        name: variables.input.name,
      }

      series.resetAfter()

      const subject = UniverseUtils.getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: UniverseRoles.Manager.key,
          profileId: otherProfile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'updateSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateSeries).toHaveProperty(
        'series',
        expect.objectContaining(expected)
      )

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })
  })

  describe('Mutation: deleteSeries', () => {
    const mutation = `
      mutation DeleteSeries($id: ID!) {
        deleteSeries(id: $id) {
          series {
            id
          }
        }
      }
    `

    const series = new TestData(
      () =>
        createSeries(SeriesFactory.makeCreateInput({universeId: universe.id})),
      deleteSeries
    )

    it('deletes an existing series', async () => {
      const {token} = credentials
      const variables = {id: series.id}

      series.resetAfter()

      const subject = UniverseUtils.getSubject(universe.id)

      const grant = await prisma.roleGrant.create({
        data: {
          roleKey: UniverseRoles.Manager.key,
          profileId: profile.id,
          subjectTable: subject.table,
          subjectId: subject.id,
        },
      })

      if (!grant) {
        fail('Grant not created')
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteSeries).toEqual({
        series: {
          id: series.id,
        },
      })

      const deleted = await prisma.series.findFirst({
        where: {id: series.id},
      })
      expect(deleted).toBeNull()

      await prisma.roleGrant.delete({
        where: {id: grant.id},
      })
    })

    it('returns an error if no existing series was found', async () => {
      const {token} = credentials
      const variables = {id: faker.datatype.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteSeries'>>(
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

    it('requires authentication', async () => {
      const variables = {id: series.id}

      const body = await graphql.mutation(mutation, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message: 'Authentication required',
          extensions: {code: 'UNAUTHENTICATED'},
        }),
      ])
    })

    it('requires authorization', async () => {
      const {token} = altCredentials
      const variables = {id: series.id}

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
