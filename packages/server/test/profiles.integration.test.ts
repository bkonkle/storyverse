import {Application, Handler} from 'express'
import request from 'supertest'
import faker from 'faker'
import jwt from 'jsonwebtoken'
import expressJwtOrig from 'express-jwt'
import {knex as Knex} from '@graft/knex'

import config from '../knexfile'
import {init} from '../src/Server'
import {User} from '../src/Schema'
import {IncomingMessage, User as TokenUser} from '../src/Config'

jest.mock('express-jwt')

const expressJwt = (expressJwtOrig as unknown) as jest.Mock<
  typeof expressJwtOrig
>

describe('[Integration] Profiles', () => {
  let app: Application

  const tokenSecret = 'test-secret'
  const token: TokenUser = {
    sub: faker.random.alphaNumeric(),
    iat: faker.random.number(),
    aud: ['test'],
    iss: faker.random.alphaNumeric(),
    exp: faker.random.number(),
    azp: faker.random.alphaNumeric(),
    scope: faker.random.alphaNumeric(),
  }
  const tokenEncoded = jwt.sign(token, tokenSecret, {algorithm: 'HS256'})

  expressJwt.mockImplementation(
    // @ts-ignore
    (): expressJwt.RequestHandler => (req: IncomingMessage, res, next) => {
      req.user = token

      next()
    }
  )

  beforeAll(() => {
    app = init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mutation: createProfile', () => {
    it('passes', async () => {
      const knex = Knex(config)

      const user = await knex<User>('users')
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

      await new Promise(resolve => setTimeout(resolve, 100))
    })
  })
})
