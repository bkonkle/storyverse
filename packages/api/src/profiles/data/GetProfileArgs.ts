import {IsUUID} from 'class-validator'

import {QueryGetProfileArgs} from '../../Schema'

export class GetProfileArgs implements QueryGetProfileArgs {
  @IsUUID()
  id!: string
}

export default GetProfileArgs
