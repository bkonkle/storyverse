import {INestApplication} from '@nestjs/common'
import supertest from 'supertest'

import {JWT} from '../../auth//JwtTypes'
import {encodeToken} from './Express'

export const handleQuery = (
  app: INestApplication,
  token: JWT,
  endpoint = '/graphql'
) => async <T>(
  query: string,
  variables?: Record<string, unknown>,
  options: {warn?: boolean; expect?: number} = {}
): Promise<{data: T}> => {
  const {warn = true, expect = 200} = options

  const response = await supertest(app.getHttpServer())
    .post(endpoint)
    .set('Authorization', `Bearer ${encodeToken(token)}`)
    .send({query, variables})
    .expect(expect)

  if (warn && response.body.errors) {
    console.error(
      response.body.errors
        .map((err: {message: string}) => err.message)
        .join('\n\n')
    )
  }

  return response.body
}

export const init = (app: INestApplication, token: JWT) => ({
  query: handleQuery(app, token),
})

export type Test = ReturnType<typeof init>
