import {Type} from 'class-transformer'
import {IsString, IsUUID} from 'class-validator'

import {UpdateUserInput, MutationUpdateUserArgs} from '../../Schema'

export class UpdateUserMutationInput implements UpdateUserInput {
  @IsString()
  username!: string
}

export class UpdateUserArgs implements MutationUpdateUserArgs {
  @IsUUID()
  id!: string

  @Type(() => UpdateUserMutationInput)
  input!: UpdateUserMutationInput
}

export default UpdateUserArgs
