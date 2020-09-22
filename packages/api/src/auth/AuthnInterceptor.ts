import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import {ALLOW_ANONYMOUS} from './AuthnDecorators'
import {GqlExecutionContext} from '@nestjs/graphql'
import {Reflector} from '@nestjs/core'

import {AUTHENTICATED, Context} from './JwtTypes'

@Injectable()
export class AuthnInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const gqlContext = GqlExecutionContext.create(context)
    const req = gqlContext.getContext<Context>().req

    const allowAnon =
      this.reflector.get<boolean | undefined>(
        ALLOW_ANONYMOUS,
        gqlContext.getHandler()
      ) || false

    if (allowAnon || req[AUTHENTICATED]) {
      return next.handle()
    }

    throw new ForbiddenException()
  }
}
