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
import ProfileFactory from '../../utils/test/factories/ProfileFactory'
import UniverseFactory from '../../utils/test/factories/UniverseFactory'
import User from '../../users/User.entity'
import Profile from '../../profiles/Profile.entity'
import Universe from '../../universes/Universe.entity'

describe('Universe', () => {
  let app: INestApplication
  let graphql: GraphQl.Test
  let db: Connection
  let users: Repository<User>
  let profiles: Repository<Profile>
  let universes: Repository<Universe>
  let typeorm: TypeOrm.Utils

  let user: User
  let profile: Profile

  let otherUser: User
  let otherProfile: Profile

  const {getCredentials, getAltCredentials} = OAuth2.init()

  const env = {
    ...process.env,
  }

  const tables = ['users', 'profiles', 'universes']

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

    await typeorm.dbCleaner(tables)
  })

  beforeEach(async () => {
    jest.resetAllMocks()

    const {username} = getCredentials()

    user = await users.save({username, isActive: true})
    profile = await profiles.save(ProfileFactory.make({userId: user.id, user}))
  })

  beforeEach(async () => {
    const {username} = getAltCredentials()

    otherUser = await users.save({username, isActive: true})
    otherProfile = await profiles.save(
      ProfileFactory.make({userId: otherUser.id, user: otherUser})
    )
  })

  afterEach(async () => {
    await typeorm.dbCleaner(tables)
  })

  describe('Mutation: createUniverse', () => {
    const mutation = `
      mutation CreateUniverse($input: CreateUniverseInput!) {
        createUniverse(input: $input) {
          universe {
            id
            name
            description
            ownedByProfileId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownedByProfileId'] as const

    it('creates a new universe', async () => {
      const {token} = getCredentials()
      const universe = UniverseFactory.makeCreateInput({
        ownedByProfileId: profile.id,
      })
      const variables = {input: universe}

      const expected: Pick<Universe, typeof fields[number]> = {
        ...variables.input,
        id: expect.stringMatching(Validation.uuidRegex),
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'createUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.createUniverse).toHaveProperty(
        'universe',
        expect.objectContaining(expected)
      )

      const created = await universes.findOne(data.createUniverse.universe?.id)
      expect(created).toMatchObject({
        ...expected,
        id: data.createUniverse.universe?.id,
      })
    })

    it('requires a name and an ownedByProfileId', async () => {
      const {token} = getCredentials()
      const universe = omit(
        UniverseFactory.makeCreateInput({ownedByProfileId: profile.id}),
        ['name', 'ownedByProfileId']
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
            'Field "ownedByProfileId" of required type "UUID!" was not provided.'
          ),
        }),
      ])
    })

    it('requires authentication', async () => {
      const universe = UniverseFactory.makeCreateInput({
        ownedByProfileId: profile.id,
      })
      const variables = {input: universe}

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

    it('requires the token sub to match the related ownedByProfile.user.username', async () => {
      const {token} = getCredentials()
      const universe = UniverseFactory.makeCreateInput({
        ownedByProfileId: otherProfile.id,
      })
      const variables = {input: universe}

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

  describe('Query: getUniverse', () => {
    const query = `
        query GetUniverse($id: UUID!) {
          getUniverse(id: $id) {
            id
            name
            description
            ownedByProfileId
          }
        }
      `
    const fields = ['id', 'name', 'description', 'ownedByProfileId']

    let universe: Universe

    beforeEach(async () => {
      universe = await universes.save(
        UniverseFactory.make({
          ownedByProfileId: profile.id,
          ownedByProfile: profile,
        })
      )
    })

    it('retrieves an existing universe', async () => {
      const {token} = getCredentials()
      const variables = {id: universe.id}

      const {data} = await graphql.query<Pick<Query, 'getUniverse'>>(
        query,
        variables,
        {token}
      )

      expect(data.getUniverse).toEqual(pick(universe, fields))
    })

    it('returns nothing when no user is found', async () => {
      const {token} = getCredentials()
      const variables = {id: universe.id}

      await universes.delete(universe.id)

      const {data} = await graphql.query<Pick<Query, 'getUniverse'>>(
        query,
        variables,
        {token}
      )

      expect(data.getUniverse).toBeFalsy()
    })

    it('requires authentication', async () => {
      const variables = {id: universe.id}

      const body = await graphql.query(query, variables, {warn: false})

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
            ownedByProfileId
          }
          count
          total
          page
          pageCount
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownedByProfileId']

    let universe: Universe
    let otherUniverse: Universe

    beforeEach(async () => {
      universe = await universes.save(
        UniverseFactory.make({
          ownedByProfileId: profile.id,
          ownedByProfile: profile,
        })
      )

      otherUniverse = await universes.save(
        UniverseFactory.make({
          ownedByProfileId: otherProfile.id,
          ownedByProfile: otherProfile,
        })
      )
    })

    it('queries existing universes', async () => {
      const {token} = getCredentials()
      const variables = {}

      const {data} = await graphql.query<Pick<Query, 'getManyUniverses'>>(
        query,
        variables,
        {token}
      )

      expect(data.getManyUniverses).toEqual({
        data: expect.arrayContaining([
          pick(universe, fields),
          pick(otherUniverse, fields),
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
      mutation UpdateUniverse($id: UUID!, $input: UpdateUniverseInput!) {
        updateUniverse(id: $id, input: $input) {
          universe {
            id
            name
            description
            ownedByProfileId
          }
        }
      }
    `
    const fields = ['id', 'name', 'description', 'ownedByProfileId'] as const

    let universe: Universe

    beforeEach(async () => {
      universe = await universes.save(
        UniverseFactory.make({
          ownedByProfileId: profile.id,
          ownedByProfile: profile,
        })
      )
    })

    it('updates an existing universe', async () => {
      const {token} = getCredentials()
      const variables = {
        id: universe.id,
        input: {name: faker.random.word()},
      }

      const expected: Pick<Universe, typeof fields[number]> = {
        ...pick(universe, fields),
        name: variables.input.name,
      }

      const {data} = await graphql.mutation<Pick<Mutation, 'updateUniverse'>>(
        mutation,
        variables,
        {token}
      )

      expect(data.updateUniverse).toHaveProperty(
        'universe',
        expect.objectContaining(expected)
      )

      const updated = await universes.findOne(universe.id)
      expect(updated).toMatchObject(expected)
    })

    it('requires the id to be a uuid', async () => {
      const {token} = getCredentials()
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
        id: universe.id,
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

    it('returns an error if no existing universe was found', async () => {
      const {token} = getCredentials()
      const variables = {
        id: faker.random.uuid(),
        input: {name: faker.random.word()},
      }

      const body = await graphql.mutation<Pick<Mutation, 'updateUniverse'>>(
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

    it('requires the token sub to match the related ownedByProfile.user.username', async () => {
      const {token} = getAltCredentials()
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

  describe('Mutation: deleteUniverse', () => {
    const mutation = `
      mutation DeleteUniverse($id: UUID!) {
        deleteUniverse(id: $id) {
          universe {
            id
          }
        }
      }
    `

    let universe: Universe

    beforeEach(async () => {
      universe = await universes.save(
        UniverseFactory.make({
          ownedByProfileId: profile.id,
          ownedByProfile: profile,
        })
      )
    })

    it('deletes an existing universe', async () => {
      const {token} = getCredentials()
      const variables = {id: universe.id}

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

      const deleted = await universes.findOne(universe.id)
      expect(deleted).toBeUndefined()
    })

    it('requires the id to be a uuid', async () => {
      const {token} = getCredentials()
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
      const variables = {id: universe.id}

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

    it('returns an error if no existing universe was found', async () => {
      const {token} = getCredentials()
      const variables = {id: faker.random.uuid()}

      const body = await graphql.mutation<Pick<Mutation, 'deleteUniverse'>>(
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

    it('requires the token sub to match the related ownedByProfile.user.username', async () => {
      const {token} = getAltCredentials()
      const variables = {id: universe.id}

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