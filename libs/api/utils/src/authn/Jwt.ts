import jwt from 'express-jwt'
import jwks from 'jwks-rsa'

export const middleware = ({
  audience,
  domain,
}: {
  audience: string
  domain: string
}) =>
  jwt({
    algorithms: ['RS256'],
    audience,
    issuer: `https://${domain}/`,
    credentialsRequired: false,
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${domain}/.well-known/jwks.json`,
    }),
  })
