import {Application} from 'express'
import request from 'supertest'

import {init} from '../src/Server'

describe('[E2E] Profiles', () => {
  let app: Application

  beforeAll(() => {
    app = init()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mutation: createProfile', () => {
    it('passes', async () => {
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

      const variables = {
        input: {
          profile: {userId},
        },
      }

      const {body} = await request(app)
        .post('/graphql')
        .send({query, variables})
      // .expect(200)

      console.log(`>- body ->`, body)
    })
  })
})
