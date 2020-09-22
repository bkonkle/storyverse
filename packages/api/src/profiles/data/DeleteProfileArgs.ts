import {IsUUID} from 'class-validator'

import {MutationDeleteProfileArgs} from '../../Schema'

export class DeleteProfileArgs implements MutationDeleteProfileArgs {
  @IsUUID()
  id!: string
}

export default DeleteProfileArgs
