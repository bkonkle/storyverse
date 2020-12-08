import {INestApplication} from '@nestjs/common'
import supertest from 'supertest'

export const handleQuery = (
  app: INestApplication,
  endpoint = '/graphql'
) => async <T>(
  query: string,
  variables?: Record<string, unknown>,
  options: {warn?: boolean; statusCode?: number; token?: string} = {}
): Promise<{data: T}> => {
  const {warn = true, statusCode = 200, token} = options

  let test = supertest(app.getHttpServer()).post(endpoint)

  if (token) {
    test = test.set('Authorization', `Bearer ${token}`)
  }

  const response = await test.send({query, variables})

  if (warn && response.body.errors) {
    console.error(
      response.body.errors
        .map((err: {message: string}) => err.message)
        .join('\n\n')
    )
  }

  expect(response.status).toEqual(statusCode)

  return response.body
}

export const init = (app: INestApplication) => ({
  query: handleQuery(app),
  mutation: handleQuery(app),
})

export type Test = ReturnType<typeof init>
