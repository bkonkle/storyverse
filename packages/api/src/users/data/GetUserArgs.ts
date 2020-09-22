import {IsUUID} from 'class-validator'

import {QueryGetUserArgs} from '../../Schema'

export class GetUserArgs implements QueryGetUserArgs {
  @IsUUID()
  id!: string
}

export default GetUserArgs
