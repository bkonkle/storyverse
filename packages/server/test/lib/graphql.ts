import {Application} from 'express'
import request from 'supertest'

import {User} from '../../src/Config'
import {encodeToken} from './jwt'

export const handleQuery = (app: Application, token: User) => async (
  query: string,
  variables?: object,
  options: {warn?: boolean} = {}
) => {
  const {warn = true} = options

  const response = await request(app)
    .post('/graphql')
    .set('Authorization', `Bearer ${encodeToken(token)}`)
    .send({query, variables})
    .expect(200)

  if (warn && response.body.errors) {
    console.error(
      new Error(response.body.errors.map(err => err.message).join(', '))
    )
  }

  return response.body
}

export const initGraphQL = (app: Application, token: User) => ({
  query: handleQuery(app, token),
})

export type GraphQL = ReturnType<typeof initGraphQL>
