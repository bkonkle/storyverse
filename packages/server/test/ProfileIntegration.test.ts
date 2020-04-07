import {Application} from 'express'
import faker from 'faker'

import {getDb, dbCleaner} from './lib/db'
import {mockJwt, getToken} from './lib/jwt'
import {init} from '../src/Server'
import {GraphQL, initGraphQL} from './lib/graphql'

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

      const profile = {
        userId: user.id,
        displayName: faker.name.findName(),
        email: faker.internet.email(),
      }

      const variables = {
        input: {profile},
      }

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
        .insert({username: faker.random.alphaNumeric(10)})
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

      const profile = {
        userId: user.id,
        displayName: faker.name.findName(),
        email: faker.internet.email(),
      }

      const variables = {
        input: {profile},
      }

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
        .insert({
          user_id: user.id,
          display_name: faker.name.findName(),
          email: faker.internet.email(),
        })
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

      const input = {email: faker.internet.email()}

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
        .insert({username: faker.random.alphaNumeric(10)})
        .returning('*')

      const [profile] = await db('profiles')
        .insert({
          user_id: user.id,
          display_name: faker.name.findName(),
          email: faker.internet.email(),
        })
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

      const input = {email: faker.internet.email()}

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
})
