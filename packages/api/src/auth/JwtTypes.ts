import {Request, Response} from 'express'
import {GraphQLExtensionStack} from 'graphql-extensions'

export interface JWT {
  jti: string // JWT id
  iss?: string // issuer
  aud?: string | string[] // audience
  sub?: string // subject
  iat?: number // issued at
  exp?: number // expires in
  nbf?: number // not before
}

export interface TokenRequest extends Request {
  user?: JWT
}

export interface Context {
  _extensionStack: GraphQLExtensionStack
  req: TokenRequest
  res: Response
}
