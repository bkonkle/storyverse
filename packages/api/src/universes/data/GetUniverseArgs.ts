import {IsUUID} from 'class-validator'

import {QueryGetUniverseArgs} from '../../Schema'

export class GetUniverseArgs implements QueryGetUniverseArgs {
  @IsUUID()
  id!: string
}

export default GetUniverseArgs
