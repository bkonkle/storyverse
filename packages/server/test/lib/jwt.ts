/* eslint-disable @typescript-eslint/ban-ts-ignore */

import expressJwt from 'express-jwt'

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
