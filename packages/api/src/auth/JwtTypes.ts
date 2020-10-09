import {Request} from 'express'
import {GraphQLExtensionStack} from 'graphql-extensions'

export const AUTHENTICATED = 'authn:authenticated'

export interface JWT {
  jti: string // JWT id
  iss?: string // issuer
  aud?: string | string[] // audience
  sub?: string // subject
  iat?: number // issued at
  exp?: number // expires in
  nbf?: number // not before
}

export interface JwtRequest extends Request {
  user?: JWT
  [AUTHENTICATED]: boolean
}

export interface JwtContext {
  _extensionStack: GraphQLExtensionStack
  req: JwtRequest
}
