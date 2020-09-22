import {Type} from 'class-transformer'
import {IsObject, IsOptional, IsString, IsUUID} from 'class-validator'

import {UpdateUniverseInput, MutationUpdateUniverseArgs} from '../../Schema'

export class UpdateUniverseMutationInput implements UpdateUniverseInput {
  @IsString()
  @IsOptional()
  name?: string

  @IsObject()
  @IsOptional()
  description?: Record<string, unknown>

  @IsUUID()
  @IsOptional()
  ownedByProfileId?: string
}

export class UpdateUniverseArgs implements MutationUpdateUniverseArgs {
  @IsUUID()
  id!: string

  @Type(() => UpdateUniverseMutationInput)
  input!: UpdateUniverseMutationInput
}

export default UpdateUniverseArgs
