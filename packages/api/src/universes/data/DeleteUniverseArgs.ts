import {IsUUID} from 'class-validator'

import {MutationDeleteUniverseArgs} from '../../Schema'

export class DeleteUniverseArgs implements MutationDeleteUniverseArgs {
  @IsUUID()
  id!: string
}

export default DeleteUniverseArgs
