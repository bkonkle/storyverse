import {Application} from 'express'
import {pick} from 'ramda'

import {init} from '../src/Server'
import {getDb, dbCleaner, pickDb} from './lib/db'
import {mockJwt, getToken} from './lib/jwt'
import {GraphQL, initGraphQL} from './lib/graphql'
import {UserFactory, ProfileFactory} from './factories'

jest.mock('express-jwt')

describe('ProfileIntegration', () => {
  let app: Application
  let graphql: GraphQL

  const token = getToken()
  mockJwt(token)

  const db = getDb()

  beforeAll(() => {
    app = init()

    graphql = initGraphQL(app, token)
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await dbCleaner()
  })

  describe('Query: allProfiles', () => {
    it('lists profiles', async () => {
      const [user] = await db('users')
        .insert(pick(['username'], UserFactory.make()))
        .returning('*')

      const [profile1, profile2] = await db('profiles')
        .insert([
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          ),
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          ),
        ])
        .returning('*')

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
          expect.objectContaining({
            displayName: profile1.display_name,
            email: profile1.email,
          }),
          expect.objectContaining({
            displayName: profile2.display_name,
            email: profile2.email,
          }),
        ])
      )
    })
  })

  describe('Query: profileById', () => {
    it('retrieves a profile', async () => {
      const [user] = await db('users')
        .insert(pick(['username'], UserFactory.make()))
        .returning('*')

      const [profile] = await db('profiles')
        .insert(
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          )
        )
        .returning('*')

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

      expect(data).toHaveProperty(
        'profileById',
        expect.objectContaining({
          displayName: profile.display_name,
          email: profile.email,
        })
      )
    })
  })

  describe('Mutation: createProfile', () => {
    it('creates a profile', async () => {
      const [user] = await db('users')
        .insert({username: token.sub})
        .returning('*')

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
      const [user] = await db('users')
        .insert(pick(['username'], UserFactory.make()))
        .returning('*')

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
      const [user] = await db('users')
        .insert({username: token.sub})
        .returning('*')

      const [profile] = await db('profiles')
        .insert(
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          )
        )
        .returning('*')

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
      const [user] = await db('users')
        .insert(pick(['username'], UserFactory.make()))
        .returning('*')

      const [profile] = await db('profiles')
        .insert(
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          )
        )
        .returning('*')

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
      const [user] = await db('users')
        .insert({username: token.sub})
        .returning('*')

      const [profile] = await db('profiles')
        .insert(
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          )
        )
        .returning('*')

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
      const [user] = await db('users')
        .insert(pick(['username'], UserFactory.make()))
        .returning('*')

      const [profile] = await db('profiles')
        .insert(
          pickDb(
            ['userId', 'displayName', 'email'],
            ProfileFactory.make({userId: user.id})
          )
        )
        .returning('*')

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
