import {Injectable} from '@nestjs/common'
import {PassportStrategy} from '@nestjs/passport'
import {ExtractJwt, Strategy} from 'passport-jwt'
import {passportJwtSecret} from 'jwks-rsa'

import ConfigService, {Vars} from '../config/ConfigService'
import {JWT} from './JwtTypes'

const DEFAULT_AUDIENCE = 'production'
const DEFAULT_ISSUER = 'https://storyverse.auth0.com/'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${
          config.getVar(Vars.Auth0Issuer) || DEFAULT_ISSUER
        }.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.getVar(Vars.Auth0Audience) || DEFAULT_AUDIENCE,
      issuer: config.getVar(Vars.Auth0Issuer) || DEFAULT_ISSUER,
      algorithms: ['RS256'],
    })
  }

  validate(payload: JWT): JWT {
    return payload
  }
}
