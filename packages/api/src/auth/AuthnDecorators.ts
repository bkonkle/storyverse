import {SetMetadata} from '@nestjs/common'

export const ALLOW_ANONYMOUS = 'authn:allow-anonymous'
export const AllowAnonymous = () => SetMetadata(ALLOW_ANONYMOUS, true)
