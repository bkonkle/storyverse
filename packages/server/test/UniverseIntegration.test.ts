import {pick} from 'ramda'

import {init} from './TestApp'
import {getDb, dbCleaner, pickDb, omitDb} from './lib/db'
import {mockJwt, getToken} from './lib/jwt'
import {GraphQL, initGraphQL} from './lib/graphql'
import {ProfileFactory, UserFactory, UniverseFactory} from './factories'

jest.mock('express-jwt')

describe.skip('UniverseIntegration', () => {
  let graphql: GraphQL

  const token = getToken()
  mockJwt(token)

  const db = getDb()

  beforeAll(async () => {
    const {app} = await init()
    graphql = initGraphQL(app, token)
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await dbCleaner()
  })

  const createUniverses = async (
    extras: [object, object] = [undefined, undefined]
  ) => {
    const [extra1, extra2] = extras

    const [user1, user2] = await db('users')
      .insert([{username: token.sub}, pickDb(['username'], UserFactory.make())])
      .returning('*')

    const [profile1, profile2] = await db('profiles')
      .insert([
        omitDb(
          ['id', 'createdAt', 'updatedAt'],
          ProfileFactory.make({userId: user1.id})
        ),
        omitDb(
          ['id', 'createdAt', 'updatedAt'],
          ProfileFactory.make({userId: user2.id})
        ),
      ])
      .returning('*')

    return db('universes')
      .insert([
        omitDb(
          ['id', 'createdAt', 'updatedAt'],
          UniverseFactory.make({ownedByProfileId: profile1.id, ...extra1})
        ),
        omitDb(
          ['id', 'createdAt', 'updatedAt'],
          UniverseFactory.make({ownedByProfileId: profile2.id, ...extra2})
        ),
      ])
      .returning('*')
  }

  describe('Query: allUniverses', () => {
    it.only('lists universes', async () => {
      const [universe] = await createUniverses()

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

      expect(data?.allUniverses).toHaveProperty('nodes', [
        {
          id: universe.id,
          name: universe.name,
        },
      ])
    })
  })

  describe('Query: universeById', () => {
    it('retrieves a universe', async () => {
      const [universe] = await createUniverses()

      const query = `
        query universeById($id: UUID!) {
          universeById (id: $id) {
            id
            displayName
            email
          }
        }
      `

      const variables = {id: universe.id}

      const {data} = await graphql.query(query, variables)

      expect(data).toHaveProperty(
        'universeById',
        expect.objectContaining({
          displayName: universe.display_name,
          email: universe.email,
        })
      )
    })

    it('requires the token sub to match the username', async () => {
      const [_, universe] = await createUniverses()

      const query = `
        query universeById($id: UUID!) {
          universeById (id: $id) {
            id
            displayName
            email
          }
        }
      `

      const variables = {id: universe.id}

      const {data} = await graphql.query(query, variables)

      expect(data.universeById).toBe(null)
    })
  })

  describe('Mutation: createUniverse', () => {
    it('creates a universe', async () => {
      const [user] = await db('users')
        .insert({username: token.sub})
        .returning('*')

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

      const universe = UniverseFactory.make({userId: user.id})
      const variables = {input: {universe}}

      const {data} = await graphql.query(query, variables)

      expect(data?.createUniverse).toHaveProperty('universe', {
        id: universe.id,
        name: universe.name,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [user] = await db('users')
        .insert(pickDb(['username'], UserFactory.make()))
        .returning('*')

      const query = `
        mutation createUniverse($input: CreateUniverseInput!) {
          createUniverse(input: $input) {
            universe {
              id
              displayName
              email
            }
          }
        }
      `

      const universe = UniverseFactory.make({userId: user.id})
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
              displayName
              email
            }
          }
        }
      `

      const input = pickDb(['email'], UniverseFactory.make())

      const variables = {
        input: {id: universe.id, universePatch: input},
      }

      const {data} = await graphql.query(query, variables)

      expect(data?.updateUniverseById).toHaveProperty('universe', {
        id: universe.id,
        displayName: universe.display_name,
        email: input.email,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, universe] = await createUniverses()

      const query = `
        mutation updateUniverseById($input: UpdateUniverseByIdInput!) {
          updateUniverseById(input: $input) {
            universe {
              id
              displayName
              email
            }
          }
        }
      `

      const input = pick(['email'], UniverseFactory.make())

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
              displayName
              email
            }
          }
        }
      `

      const variables = {input: {id: universe.id}}

      const {data} = await graphql.query(query, variables)

      expect(data?.deleteUniverseById).toHaveProperty('universe', {
        id: universe.id,
        displayName: universe.display_name,
        email: universe.email,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, universe] = await createUniverses()

      const query = `
        mutation deleteUniverseById($input: DeleteUniverseByIdInput!) {
          deleteUniverseById(input: $input) {
            universe {
              id
              displayName
              email
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
