import {INestApplication} from '@nestjs/common'
import supertest from 'supertest'

import {JWT} from '../../auth//JwtTypes'
import {encodeToken} from './Express'

export const handleQuery = (
  app: INestApplication,
  endpoint = '/graphql'
) => async <T>(
  query: string,
  variables?: Record<string, unknown>,
  options: {warn?: boolean; expect?: number; token?: JWT} = {}
): Promise<{data: T}> => {
  const {warn = true, expect = 200, token} = options

  let test = supertest(app.getHttpServer()).post(endpoint)

  if (token) {
    test = test.set('Authorization', `Bearer ${encodeToken(token)}`)
  }

  const response = await test.send({query, variables}).expect(expect)

  if (warn && response.body.errors) {
    console.error(
      response.body.errors
        .map((err: {message: string}) => err.message)
        .join('\n\n')
    )
  }

  return response.body
}

export const init = (app: INestApplication) => ({
  query: handleQuery(app),
})

export type Test = ReturnType<typeof init>
