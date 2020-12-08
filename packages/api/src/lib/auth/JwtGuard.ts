import {isObservable} from 'rxjs'
import {ExecutionContext, Injectable, Optional} from '@nestjs/common'
import {GqlExecutionContext} from '@nestjs/graphql'
import {AuthGuard, AuthModuleOptions} from '@nestjs/passport'

import {AUTHENTICATED, JwtContext} from './JwtTypes'

@Injectable()
export class RequireAuthentication extends AuthGuard('jwt') {
  constructor(@Optional() protected readonly options?: AuthModuleOptions) {
    super(options)
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext<JwtContext>().req
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context)
    const canActivate = super.canActivate(context)

    const success = isObservable(canActivate)
      ? await canActivate.toPromise()
      : await canActivate

    // Annotate the success on the request object so that the interceptor can check for it.
    if (success) {
      req[AUTHENTICATED] = true
    }

    return success
  }
}
