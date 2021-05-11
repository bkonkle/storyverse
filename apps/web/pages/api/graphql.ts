/* Inspired by https://github.com/stegano/next-http-proxy-middleware */
import {NextApiRequest, NextApiResponse} from 'next'
import {createProxyMiddleware} from 'http-proxy-middleware'
import jwt from 'next-auth/jwt'
import express from 'express'

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
  onProxyReq: (proxyReq, req) => {
    const request = (req as unknown) as NextApiRequest & {token?: Auth0Token}
    const {body, token} = request

    if (['POST', 'PUT'].indexOf(req.method as string) >= 0) {
      token &&
        proxyReq.setHeader('Authorization', `Bearer ${token.accessToken}`)

      proxyReq.write(typeof body === 'string' ? body : JSON.stringify(body))
      proxyReq.end()
    }
  },
})

export default async function (
  req: NextApiRequest & {token?: Auth0Token},
  res: NextApiResponse
) {
  const response = await jwt.getToken({
    req,
    secret: process.env.OAUTH2_JWT_SECRET || '',
  })
  req.token = (response as unknown) as Auth0Token

  return await new Promise((resolve, reject) => {
    proxy(
      (req as unknown) as express.Request,
      (res as unknown) as express.Response,
      (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }

        return resolve(result)
      }
    )
  })
}
