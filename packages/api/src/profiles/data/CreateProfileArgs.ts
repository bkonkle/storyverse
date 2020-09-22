import {Type} from 'class-transformer'
import {IsObject, IsOptional, IsString} from 'class-validator'

import {CreateProfileInput, MutationCreateProfileArgs} from '../../Schema'

export class CreateProfileMutationInput implements CreateProfileInput {
  @IsString()
  email!: string

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
  userId!: string
}

export class CreateProfileArgs implements MutationCreateProfileArgs {
  @Type(() => CreateProfileMutationInput)
  input!: CreateProfileMutationInput
}

export default CreateProfileArgs
