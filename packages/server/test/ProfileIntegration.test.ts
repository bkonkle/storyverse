import {pick} from 'ramda'
import {
  GraphQL,
  dbCleaner,
  getDb,
  getToken,
  initGraphQL,
  mockJwt,
  omitDb,
  pickDb,
} from '@graft/server/test'

import config from '../knexfile'
import {TABLES, init} from './TestApp'
import {UserFactory, ProfileFactory} from './factories'

jest.mock('express-jwt')

describe('ProfileIntegration', () => {
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

  const createUsers = async (
    extras: [object, object] = [undefined, undefined]
  ) => {
    const [extra1, extra2] = extras

    return db('users')
      .insert([
        {username: token.sub, ...extra1},
        pickDb(['username'], UserFactory.make(extra2)),
      ])
      .returning('*')
  }

  const createProfiles = async (
    extras: [object, object] = [undefined, undefined],
    users?: [object, object]
  ) => {
    const [extra1, extra2] = extras
    const [user1, user2] = users || (await createUsers())

    return db('profiles')
      .insert([
        omitDb(
          ['id', 'createdAt', 'updatedAt'],
          ProfileFactory.make({userId: user1.id, ...extra1})
        ),
        omitDb(
          ['id', 'createdAt', 'updatedAt'],
          ProfileFactory.make({userId: user2.id, ...extra2})
        ),
      ])
      .returning('*')
  }

  describe('Query: allProfiles', () => {
    it('lists profiles', async () => {
      const [profile1, profile2] = await createProfiles()

      const query = `
        query allProfiles {
          allProfiles {
            nodes {
              id
              displayName
              email
            }
          }
        }
      `

      const {data} = await graphql.query(query)

      expect(data?.allProfiles).toHaveProperty(
        'nodes',
        expect.arrayContaining([
          {
            id: profile1.id,
            displayName: profile1.display_name,
            email: profile1.email,
          },
          {
            id: profile2.id,
            displayName: profile2.display_name,
            email: profile2.email,
          },
        ])
      )
    })
  })

  describe('Query: profileById', () => {
    it('retrieves a profile', async () => {
      const [profile] = await createProfiles()

      const query = `
        query profileById($id: UUID!) {
          profileById (id: $id) {
            id
            displayName
            email
          }
        }
      `

      const variables = {id: profile.id}

      const {data} = await graphql.query(query, variables)

      expect(data).toHaveProperty('profileById', {
        id: profile.id,
        displayName: profile.display_name,
        email: profile.email,
      })
    })
  })

  describe('Mutation: createProfile', () => {
    it('creates a profile', async () => {
      const [user] = await createUsers()

      const query = `
        mutation createProfile($input: CreateProfileInput!) {
          createProfile(input: $input) {
            profile {
              id
              displayName
              email
            }
          }
        }
      `

      const profile = ProfileFactory.make({userId: user.id})
      const variables = {input: {profile}}

      const {data} = await graphql.query(query, variables)

      expect(data?.createProfile).toHaveProperty(
        'profile',
        expect.objectContaining({
          displayName: profile.displayName,
          email: profile.email,
        })
      )
    })

    it('requires the token sub to match the username', async () => {
      const [_, user] = await createUsers()

      const query = `
        mutation createProfile($input: CreateProfileInput!) {
          createProfile(input: $input) {
            profile {
              id
              displayName
              email
            }
          }
        }
      `

      const profile = ProfileFactory.make({userId: user.id})
      const variables = {input: {profile}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            'new row violates row-level security policy for table "profiles"',
        }),
      ])
    })
  })

  describe('Mutation: updateProfileById', () => {
    it('updates an existing profile', async () => {
      const [profile] = await createProfiles()

      const query = `
        mutation updateProfileById($input: UpdateProfileByIdInput!) {
          updateProfileById(input: $input) {
            profile {
              id
              displayName
              email
            }
          }
        }
      `

      const input = pick(['email'], ProfileFactory.make())

      const variables = {
        input: {id: profile.id, profilePatch: input},
      }

      const {data} = await graphql.query(query, variables)

      expect(data?.updateProfileById).toHaveProperty('profile', {
        id: profile.id,
        displayName: profile.display_name,
        email: input.email,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, profile] = await createProfiles()

      const query = `
        mutation updateProfileById($input: UpdateProfileByIdInput!) {
          updateProfileById(input: $input) {
            profile {
              id
              displayName
              email
            }
          }
        }
      `

      const input = pick(['email'], ProfileFactory.make())

      const variables = {
        input: {id: profile.id, profilePatch: input},
      }

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            "No values were updated in collection 'profiles' because no values you can update were found matching these criteria.",
        }),
      ])
    })
  })

  describe('Mutation: deleteProfileById', () => {
    it('updates an existing profile', async () => {
      const [profile] = await createProfiles()

      const query = `
        mutation deleteProfileById($input: DeleteProfileByIdInput!) {
          deleteProfileById(input: $input) {
            profile {
              id
              displayName
              email
            }
          }
        }
      `

      const variables = {input: {id: profile.id}}

      const {data} = await graphql.query(query, variables)

      expect(data?.deleteProfileById).toHaveProperty('profile', {
        id: profile.id,
        displayName: profile.display_name,
        email: profile.email,
      })
    })

    it('requires the token sub to match the username', async () => {
      const [_, profile] = await createProfiles()

      const query = `
        mutation deleteProfileById($input: DeleteProfileByIdInput!) {
          deleteProfileById(input: $input) {
            profile {
              id
              displayName
              email
            }
          }
        }
      `

      const variables = {input: {id: profile.id}}

      const body = await graphql.query(query, variables, {warn: false})

      expect(body).toHaveProperty('errors', [
        expect.objectContaining({
          message:
            "No values were deleted in collection 'profiles' because no values you can delete were found matching these criteria.",
        }),
      ])
    })
  })
})
