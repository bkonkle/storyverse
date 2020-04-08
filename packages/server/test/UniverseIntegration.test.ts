import {pick} from 'ramda'
import {
  GraphQL,
  dbCleaner,
  getDb,
  getToken,
  initGraphQL,
  mockJwt,
} from '@graft/server/test'

import config from '../knexfile'
import {TABLES, init} from './TestApp'
import {UniverseFactory} from './factories'
import {handleCreateProfiles, handleCreateUniverses} from './TestData'

jest.mock('express-jwt')

describe('Universe Integration', () => {
  let graphql: GraphQL

  const token = getToken()
  mockJwt(token)

  const db = getDb(config)

  beforeAll(async () => {
    const {app} = await init()
    graphql = initGraphQL(app, token)
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await dbCleaner(db, TABLES)
  })

  const createProfiles = handleCreateProfiles(db, token)
  const createUniverses = handleCreateUniverses(db, token)

  describe('Query: allUniverses', () => {
    it('lists universes', async () => {
      const [universe1, universe2] = await createUniverses()

      const query = `
        query allUniverses {
          allUniverses {
            nodes {
              id
              name
            }
          }
        }
      `

      const {data} = await graphql.query(query)

      expect(data?.allUniverses).toHaveProperty(
        'nodes',
        expect.arrayContaining([
          {
            id: universe1.id,
            name: universe1.name,
          },
          {
            id: universe2.id,
            name: universe2.name,
          },
        ])
      )
    })
  })

  describe('Query: universeById', () => {
    it('retrieves a universe', async () => {
      const [universe] = await createUniverses()

      const query = `
        query universeById($id: UUID!) {
          universeById (id: $id) {
            id
            name
          }
        }
      `

      const variables = {id: universe.id}

      const {data} = await graphql.query(query, variables)

      expect(data).toHaveProperty('universeById', {
        id: universe.id,
        name: universe.name,
      })
    })
  })

  describe('Mutation: createUniverse', () => {
    it('creates a universe', async () => {
      const [profile] = await createProfiles()

      const query = `
        mutation createUniverse($input: CreateUniverseInput!) {
          createUniverse(input: $input) {
            universe {
              id
              name
            }
          }
        }
      `

      const universe = UniverseFactory.make({
        ownedByProfileId: profile.id,
      })
      const variables = {input: {universe}}

      const {data} = await graphql.query(query, variables)

      expect(data?.createUniverse).toHaveProperty('universe', {
        id: universe.id,
        name: universe.name,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, profile] = await createProfiles()

      const query = `
        mutation createUniverse($input: CreateUniverseInput!) {
          createUniverse(input: $input) {
            universe {
              id
              name
            }
          }
        }
      `

      const universe = UniverseFactory.make({
        ownedByProfileId: profile.id,
      })
      const variables = {input: {universe}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            'new row violates row-level security policy for table "universes"',
        }),
      ])
    })
  })

  describe('Mutation: updateUniverseById', () => {
    it('updates an existing universe', async () => {
      const [universe] = await createUniverses()

      const query = `
        mutation updateUniverseById($input: UpdateUniverseByIdInput!) {
          updateUniverseById(input: $input) {
            universe {
              id
              name
            }
          }
        }
      `

      const input = pick(['name'], UniverseFactory.make())

      const variables = {
        input: {id: universe.id, universePatch: input},
      }

      const {data} = await graphql.query(query, variables)

      expect(data?.updateUniverseById).toHaveProperty('universe', {
        id: universe.id,
        name: input.name,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, universe] = await createUniverses()

      const query = `
        mutation updateUniverseById($input: UpdateUniverseByIdInput!) {
          updateUniverseById(input: $input) {
            universe {
              id
              name
            }
          }
        }
      `

      const input = pick(['name'], UniverseFactory.make())

      const variables = {
        input: {id: universe.id, universePatch: input},
      }

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            "No values were updated in collection 'universes' because no values you can update were found matching these criteria.",
        }),
      ])
    })
  })

  describe('Mutation: deleteUniverseById', () => {
    it('updates an existing universe', async () => {
      const [universe] = await createUniverses()

      const query = `
        mutation deleteUniverseById($input: DeleteUniverseByIdInput!) {
          deleteUniverseById(input: $input) {
            universe {
              id
              name
            }
          }
        }
      `

      const variables = {input: {id: universe.id}}

      const {data} = await graphql.query(query, variables)

      expect(data?.deleteUniverseById).toHaveProperty('universe', {
        id: universe.id,
        name: universe.name,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, universe] = await createUniverses()

      const query = `
        mutation deleteUniverseById($input: DeleteUniverseByIdInput!) {
          deleteUniverseById(input: $input) {
            universe {
              id
              name
            }
          }
        }
      `

      const variables = {input: {id: universe.id}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            "No values were deleted in collection 'universes' because no values you can delete were found matching these criteria.",
        }),
      ])
    })
  })
})
