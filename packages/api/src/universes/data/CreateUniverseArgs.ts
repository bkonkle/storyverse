import {Type} from 'class-transformer'
import {IsObject, IsOptional, IsString, IsUUID} from 'class-validator'

import {CreateUniverseInput, MutationCreateUniverseArgs} from '../../Schema'

export class CreateUniverseMutationInput implements CreateUniverseInput {
  @IsString()
  name!: string

  @IsObject()
  @IsOptional()
  description?: Record<string, unknown>

  @IsUUID()
  ownedByProfileId!: string
}

export class CreateUniverseArgs implements MutationCreateUniverseArgs {
  @Type(() => CreateUniverseMutationInput)
  input!: CreateUniverseMutationInput
}

export default CreateUniverseArgs
