import {Type} from 'class-transformer'
import {IsObject, IsOptional, IsString, IsUUID} from 'class-validator'

import {UpdateProfileInput, MutationUpdateProfileArgs} from '../../Schema'

export class UpdateProfileMutationInput implements UpdateProfileInput {
  @IsString()
  @IsOptional()
  email?: string

  @IsString()
  @IsOptional()
  displayName?: string

  @IsString()
  @IsOptional()
  picture?: string

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>

  @IsString()
  @IsOptional()
  userId?: string
}

export class UpdateProfileArgs implements MutationUpdateProfileArgs {
  @IsUUID()
  id!: string

  @Type(() => UpdateProfileMutationInput)
  input!: UpdateProfileMutationInput
}

export default UpdateProfileArgs
