import {IsUUID} from 'class-validator'

import {MutationDeleteUserArgs} from '../../Schema'

export class DeleteUserArgs implements MutationDeleteUserArgs {
  @IsUUID()
  id!: string
}

export default DeleteUserArgs
