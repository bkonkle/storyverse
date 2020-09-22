import {ExecutionContext, Injectable, Optional} from '@nestjs/common'
import {GqlExecutionContext} from '@nestjs/graphql'
import {AuthGuard, AuthModuleOptions} from '@nestjs/passport'

import {AUTHENTICATED, Context} from './JwtTypes'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(@Optional() protected readonly options?: AuthModuleOptions) {
    super(options)
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext<Context>().req
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const success = (await super.canActivate(context)) as boolean

    if (success) {
      const req = this.getRequest(context)
      req[AUTHENTICATED] = true
    }

    return success
  }
}
