/* eslint-disable @typescript-eslint/ban-ts-ignore */
import expressJwt from 'express-jwt'
import faker from 'faker'
import jwt from 'jsonwebtoken'

import {User} from '../../src/Config'

jest.mock('express-jwt')

const eJwt = (expressJwt as unknown) as jest.Mock<typeof expressJwt>

export const mockJwt = (token: User) => {
  eJwt.mockImplementation(
    // @ts-ignore
    (): expressJwt.RequestHandler => (req: IncomingMessage, _res, next) => {
      req.user = token

      next()
    }
  )

  return eJwt
}

export const getToken = (): [User, string] => {
  const tokenSecret = 'test-secret'
  const token: User = {
    sub: faker.random.alphaNumeric(),
    iat: faker.random.number(),
    aud: ['localhost'],
    iss: faker.random.alphaNumeric(),
    exp: faker.random.number(),
    azp: faker.random.alphaNumeric(),
    scope: faker.random.alphaNumeric(),
  }
  const tokenEncoded = jwt.sign(token, tokenSecret, {algorithm: 'HS256'})

  return [token, tokenEncoded]
}
