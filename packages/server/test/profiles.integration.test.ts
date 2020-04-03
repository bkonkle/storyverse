import {Application} from 'express'
import request from 'supertest'
import faker from 'faker'

import {getDb, dbCleaner} from './lib/db'
import {mockJwt, getToken} from './lib/jwt'
import {init} from '../src/Server'

describe('[Integration] Profiles', () => {
  let app: Application

  const [token, tokenEncoded] = getToken()
  mockJwt(token)

  const db = getDb()

  beforeAll(() => {
    app = init()
  })

  beforeEach(async () => {
    jest.clearAllMocks()

    await dbCleaner()
  })

  describe('Mutation: createProfile', () => {
    it('creates a profile', async () => {
      const user = await db('users')
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
        userId: user[0].id,
        displayName: faker.name.findName(),
        email: faker.internet.email(),
      }

      const variables = {
        input: {profile},
      }

      const {body} = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${tokenEncoded}`)
        .send({query, variables})
        .expect(200)

      expect(body.data.createProfile).toHaveProperty(
        'profile',
        expect.objectContaining({
          displayName: profile.displayName,
          email: profile.email,
        })
      )
    })

    it('requires the token sub to match the username', async () => {
      const [user] = await db('users')
        .insert({username: faker.random.alphaNumeric()})
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

      const {body} = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${tokenEncoded}`)
        .send({query, variables})
        .expect(200)

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

      const {body} = await request(app)
        .post('/graphql')
        .set('Authorization', `Bearer ${tokenEncoded}`)
        .send({query, variables})
        .expect(200)

      expect(body.data.updateProfileById).toHaveProperty('profile', {
        id: profile.id,
        displayName: profile.display_name,
        email: input.email,
      })
    })
  })
})
