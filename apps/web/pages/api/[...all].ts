import {NextApiRequest, NextApiResponse} from 'next'
import {createProxyMiddleware} from 'http-proxy-middleware'
import jwt from 'next-auth/jwt'
import {Request, Response} from 'express'
import cookie from 'cookie'

export interface Auth0Token {
  sub: string
  name: string
  email: string
  picture: string
  accessToken: string
  iat: number
  exp: number
}

const proxy = createProxyMiddleware({
  target: process.env.API_URL,
  changeOrigin: true,
  pathRewrite: {'^/api': ''},
  ws: true,
  logLevel: 'debug',
  onProxyReqWs: (proxyReq, req) => {
    const end = proxyReq.end

    proxyReq.end = () => {
      // skip this, because we want to wait for the token below
    }

    const run = async () => {
      req.cookies = req.headers.cookie
        ? cookie.parse(req.headers.cookie)
        : undefined

      const token = await jwt.getToken({
        req: req as unknown as NextApiRequest,
        secret: process.env.OAUTH2_JWT_SECRET || '',
      })

      if (token) {
        proxyReq.setHeader('Authorization', `Bearer ${token.accessToken}`)
      }

      end.apply(proxyReq)
    }

    run().catch((err) => {
      console.error('proxyReqWs Error:', err)
    })
  },
})

export default async function (
  req: NextApiRequest & {token?: jwt.JWT},
  res: NextApiResponse
) {
  const token = await jwt.getToken({
    req: req as NextApiRequest,
    secret: process.env.OAUTH2_JWT_SECRET || '',
  })
  if (token) req.headers['Authorization'] = `Bearer ${token.accessToken}`

  return new Promise<void>((resolve, reject) => {
    proxy(
      req as unknown as Request,
      res as unknown as Response,
      (result: unknown) => {
        if (result instanceof Error) {
          return reject(result)
        }

        return resolve()
      }
    )
  })
}
