import {Token} from 'cultivar/express'

export const init = (initialToken: Token) => {
  const middleware = jest.fn()

  const mock = (token: Token) =>
    middleware.mockImplementation((req, _res, next) => {
      req.user = token

      next()
    })

  return {
    middleware,
    setToken: (token: Token) => mock(token),
    reset: () => mock(initialToken),
  }
}

export default {init}
