import {decode} from 'jsonwebtoken'
import {Response} from 'express'
import {Injectable, NestMiddleware} from '@nestjs/common'

import {Token, AuthenticatedRequest} from './JwtTypes'

@Injectable()
export class DecoderMiddleware implements NestMiddleware {
  public use(
    req: AuthenticatedRequest,
    _res: Response,
    next: () => unknown
  ): void {
    const auth: string = req.headers.authorization || ''
    const token: Token | undefined | null = decode(auth.split(' ')[1] || '')

    req.jwt = token

    next()
  }
}

export default DecoderMiddleware
