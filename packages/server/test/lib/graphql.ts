import {Application} from 'express'
import supertest from 'supertest'

import {User} from '../../src/Config'
import {encodeToken} from './jwt'

export const handleQuery = (app: Application, token: User) => async (
  query: string,
  variables?: object,
  options: {warn?: boolean; expect?: number} = {}
) => {
  const {warn = true, expect = 200} = options

  const response = await supertest
    .agent(app)
    .post('/graphql')
    .set('Authorization', `Bearer ${encodeToken(token)}`)
    .send({query, variables})
    .expect(expect)

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
