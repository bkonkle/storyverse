import {Request} from 'express'

export interface JWT {
  jti: string // JWT id
  iss?: string // issuer
  aud?: string // audience
  sub?: string // subject
  iat?: number // issued at
  exp?: number // expires in
  nbf?: number // not before
}

export type Token = JWT | {[key: string]: unknown} | string

export interface AuthenticatedRequest extends Request {
  jwt?: Token | undefined | null
}
