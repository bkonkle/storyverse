/* Inspired by https://github.com/stegano/next-http-proxy-middleware */
import {NextApiRequest, NextApiResponse} from 'next'
import httpProxy from 'http-proxy'
import http from 'http'
import jwt from 'next-auth/jwt'

export interface Auth0Token {
  sub: string
  name: string
  email: string
  picture: string
  accessToken: string
  iat: number
  exp: number
}

const proxy: httpProxy = httpProxy.createProxy()

/**
 * If a key pattern is found in `pathRewrite` that matches the url value,
 * replace matched string of url with the `pathRewrite` value.
 * @param req
 * @param pathRewrite
 */
const rewritePath = (url: string, pathRewrite: {[key: string]: string}) => {
  for (const str in pathRewrite) {
    const pattern = RegExp(str)
    const path = pathRewrite[str]
    if (pattern.test(url as string)) {
      return url.replace(pattern, path)
    }
  }
  return url
}

const handleReq = (
  proxyReq: http.ClientRequest,
  req: http.IncomingMessage
): void => {
  const body = (req as NextApiRequest).body

  if (
    ['POST', 'PUT'].indexOf(req.method as string) >= 0 &&
    typeof body === 'string'
  ) {
    proxyReq.write(body)
    proxyReq.end()
  }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const response = await jwt.getToken({
    req,
    secret: process.env.OAUTH2_JWT_SECRET || '',
  })
  const token = (response as unknown) as Auth0Token

  return new Promise((resolve, reject) => {
    req.url = rewritePath(req.url as string, {
      '^/api': '',
    })

    if (
      ['POST', 'PUT'].indexOf(req.method as string) >= 0 &&
      typeof req.body === 'object'
    ) {
      req.body = JSON.stringify(req.body)
    }

    const headers: Record<string, string> = {}
    if (token?.accessToken) {
      headers.Authorization = `Bearer ${token.accessToken}`
    }

    proxy
      .once('proxyReq', handleReq)
      .once('proxyRes', resolve)
      .once('error', reject)
      .web(req, res, {
        target: process.env.API_URL,
        changeOrigin: true,
        headers,
      })
  })
}
