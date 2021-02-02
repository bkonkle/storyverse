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
import UniverseFactory from '../../utils/test/factories/UniverseFactory'
import SeriesFactory from '../../utils/test/factories/SeriesFactory'
import * as UniverseRoles from '../../universes/UniverseRoles'
import User from '../../users/User.entity'
import Profile from '../../profiles/Profile.entity'
import Universe from '../../universes/Universe.entity'
import RoleGrantsService from '../../authorization/RoleGrantsService'
import Series from '../Series.entity'
import {Manager} from '../SeriesRoles'
import {subjectInput} from '../SeriesUtils'

describe('Series', () => {
  let app: INestApplication
  let graphql: GraphQl.Test
  let db: Connection
  let users: Repository<User>
  let profiles: Repository<Profile>
  let universes: Repository<Universe>
  let seriesRepo: Repository<Series>
  let grants: RoleGrantsService
  let typeorm: TypeOrm.Utils

  let user: User
  let profile: Profile
  let universe: Universe

  let otherUser: User
  let otherProfile: Profile
  let otherUniverse: Universe

  const {credentials, altCredentials} = OAuth2.init()

  const env = {
    ...process.env,
  }

  const tables = ['users', 'profiles', 'universes', 'series']

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
    universes = db.getRepository(Universe)
    seriesRepo = db.getRepository(Series)

    grants = app.get(RoleGrantsService)

    await typeorm.dbCleaner(tables)
  })

  beforeEach(async () => {
    jest.resetAllMocks()
  })

  beforeAll(async () => {
    const {username} = credentials

    user = await users.save({username, isActive: true})
    profile = await profiles.save(ProfileFactory.make({userId: user.id, user}))
    universe = await universes.save(
      UniverseFactory.make({ownerProfileId: profile.id, ownerProfile: profile})
    )
  })

  beforeAll(async () => {
    const {username} = altCredentials

    otherUser = await users.save({username, isActive: true})
    otherProfile = await profiles.save(
      ProfileFactory.make({userId: otherUser.id, user: otherUser})
    )
    otherUniverse = await universes.save(
      UniverseFactory.make({
        ownerProfileId: otherProfile.id,
        ownerProfile: otherProfile,
      })
    )
  })

  describe('Mutation: createSeries', () => {
    const mutation = `
      mutation CreateSeries($input: CreateSeriesInput!) {
        createSeries(input: $input) {
          universe {
            id
            name
            description
            universeId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'universeId'] as const

    it('creates a new series', async () => {
      const {token} = credentials
      const series = SeriesFactory.makeCreateInput({
        universeId: universe.id,
      })
      const variables = {input: series}

      const expected: Pick<Series, typeof fields[number]> = {
        ...variables.input,
        id: expect.stringMatching(Validation.uuidRegex),
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.createSeries).toHaveProperty(
        'series',
        expect.objectContaining(expected)
      )

      const created = await seriesRepo.findOne(data.createSeries.series?.id)

      if (!created) {
        fail('No series created.')
      }

      expect(created).toMatchObject({
        ...expected,
        id: data.createSeries.series?.id,
      })

      await seriesRepo.delete(created.id)
    })

    it('requires a name and an universeId', async () => {
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
            'Field name of required type String! was not provided.'
          ),
        }),
        expect.objectContaining({
          message: expect.stringContaining(
            'Field universeId of required type UUID! was not provided.'
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

  describe('Query: getSeries', () => {
    const query = `
        query GetSeries($id: UUID!) {
          getSeries(id: $id) {
            id
            name
            description
            universeId
            universe {
              name
              description
            }
          }
        }
      `
    const fields = [
      'id',
      'name',
      'description',
      'universeId',
      'universe.name',
      'universe.description',
    ]

    const series = new TestData(
      () => seriesRepo,
      () =>
        SeriesFactory.make({
          universeId: universe.id,
          universe,
        })
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
            universeId
            universe {
              name
              description
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
      'name',
      'description',
      'universeId',
      'universe.name',
      'universe.description',
    ]

    const series = new TestData(
      () => seriesRepo,
      () =>
        SeriesFactory.make({
          universeId: universe.id,
          universe,
        })
    )
    const otherSeries = new TestData(
      () => seriesRepo,
      () =>
        SeriesFactory.make({
          universeId: otherUniverse.id,
          universe,
        })
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
      mutation UpdateSeries($id: UUID!, $input: UpdateSeriesInput!) {
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
      () => seriesRepo,
      () =>
        SeriesFactory.make({
          universeId: universe.id,
          universe,
        })
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

      const {data} = await graphql.mutation<Pick<Mutation, 'updateSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateSeries).toHaveProperty(
        'series',
        expect.objectContaining(expected)
      )

      const updated = await seriesRepo.findOne(series.id)
      expect(updated).toMatchObject(expected)
    })

    it('requires the id to be a uuid', async () => {
      const {token} = credentials
      const variables = {
        id: 'test-id',
        input: {name: faker.random.word()},
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
        id: series.id,
        input: {name: faker.random.word()},
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

    it('returns an error if no existing series was found', async () => {
      const {token} = credentials
      const variables = {
        id: faker.random.uuid(),
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateSeries'>>(
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
        id: series.id,
        input: {name: faker.random.word()},
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

    it('allows users with the Update permission', async () => {
      const {token} = altCredentials
      const variables = {
        id: series.id,
        input: {name: faker.random.word()},
      }

      const grant = await grants.create({
        roleKey: Manager.key,
        profileId: otherProfile.id,
        ...subjectInput(series.id),
      })

      if (!grant) {
        fail('Grant not created')
      }

      const expected: Pick<Series, typeof fields[number]> = {
        ...pick(series.value!, fields),
        name: variables.input.name,
      }

      series.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'updateSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateSeries).toHaveProperty(
        'series',
        expect.objectContaining(expected)
      )

      await grants.delete(grant.id)
    })
  })

  describe('Mutation: deleteSeries', () => {
    const mutation = `
      mutation DeleteSeries($id: UUID!) {
        deleteSeries(id: $id) {
          series {
            id
          }
        }
      }
    `

    const series = new TestData(
      () => seriesRepo,
      () =>
        SeriesFactory.make({
          universeId: universe.id,
          universe,
        })
    )

    it('deletes an existing series', async () => {
      const {token} = credentials
      const variables = {id: series.id}

      series.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteSeries).toEqual({
        series: {
          id: universe.id,
        },
      })

      const deleted = await seriesRepo.findOne(series.id)
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
      const variables = {id: series.id}

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

    it('returns an error if no existing series was found', async () => {
      const {token} = credentials
      const variables = {id: faker.random.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteSeries'>>(
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
      const variables = {id: series.id}

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

    it('allows users with the ManageSeries permission', async () => {
      const {token} = altCredentials
      const variables = {id: universe.id}

      const grant = await grants.create({
        roleKey: UniverseRoles.ManageSeries.key,
        profileId: otherProfile.id,
        ...subjectInput(universe.id),
      })

      if (!grant) {
        fail('Grant not created')
      }

      series.resetAfter()

      const {data} = await graphql.mutation<Pick<Mutation, 'deleteSeries'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.deleteSeries).toEqual({
        series: {
          id: universe.id,
        },
      })

      const deleted = await seriesRepo.findOne(series.id)
      expect(deleted).toBeUndefined()
    })
  })
})
