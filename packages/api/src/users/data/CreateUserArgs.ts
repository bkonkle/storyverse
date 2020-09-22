import {Type} from 'class-transformer'
import {IsString} from 'class-validator'

import {CreateUserInput, MutationCreateUserArgs} from '../../Schema'

export class CreateUserMutationInput implements CreateUserInput {
  @IsString()
  username!: string
}

export class CreateUserArgs implements MutationCreateUserArgs {
  @Type(() => CreateUserMutationInput)
  input!: CreateUserMutationInput
}

export default CreateUserArgs
