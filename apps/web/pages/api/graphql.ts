/* Inspired by https://github.com/stegano/next-http-proxy-middleware */
import {NextApiRequest, NextApiResponse} from 'next'
import httpProxy from 'http-proxy'
import http from 'http'
import {getSession} from 'next-auth/client'

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
  const session = await getSession({
    req,
  })
  console.log(`>- session ->`, session)

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

    const headers = {
      Authorization: session?.accessToken
        ? `Bearer ${session.accessToken}`
        : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJuYW1lIjoiYnJhbmRvbi5rb25rbGUrc3Rvcnl2ZXJzZS1kZXYiLCJlbWFpbCI6ImJyYW5kb24ua29ua2xlK3N0b3J5dmVyc2UtZGV2QGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9jNzE4NjQyYzg2ZTNkOGZjMDNhMGExNWRhZjM5NDkwOT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRmJyLnBuZyIsInN1YiI6ImF1dGgwfDVmY2VjMTkwOTQ1OTc5MDA3NTgyNDFjYyIsImlhdCI6MTYxNTIzMjQ2NiwiZXhwIjoxNjE3ODI0NDY2fQ.rfHQrMLhXCxXR7C565TXvEgnoKAZoIs3fryTdwZs2NQrNQ28F2VlR4mqYrK2y6URPIGtIlwjCUubTSDgfpQ9Hw',
    }

    console.log(`>- headers ->`, headers)

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
