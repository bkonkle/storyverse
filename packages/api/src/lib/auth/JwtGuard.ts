import {ExecutionContext, Injectable, Optional} from '@nestjs/common'
import {GqlExecutionContext} from '@nestjs/graphql'
import {AuthGuard, AuthModuleOptions} from '@nestjs/passport'

import {JwtContext} from './JwtTypes'

@Injectable()
export class RequireAuthentication extends AuthGuard('jwt') {
  constructor(@Optional() protected readonly options?: AuthModuleOptions) {
    super(options)
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)

    return ctx.getContext<JwtContext>().req
  }
}
