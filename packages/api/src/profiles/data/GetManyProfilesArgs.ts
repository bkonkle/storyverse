import {Type} from 'class-transformer'
import {
  IsUUID,
  IsOptional,
  IsString,
  IsObject,
  IsDate,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator'

import {
  QueryGetManyProfilesArgs,
  ProfileCondition,
  ProfilesOrderBy,
} from '../../Schema'

export class ProfileConditionInput implements ProfileCondition {
  @IsUUID()
  @IsOptional()
  id?: string

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

  @IsDate()
  @IsOptional()
  createdAt?: Date

  @IsDate()
  @IsOptional()
  updatedAt?: Date
}

export class GetManyProfilesArgs implements QueryGetManyProfilesArgs {
  @Type(() => ProfileConditionInput)
  @IsOptional()
  where?: ProfileConditionInput

  @IsArray()
  @IsEnum(Object.values(ProfilesOrderBy))
  @IsOptional()
  orderBy?: ProfilesOrderBy[]

  @IsNumber()
  @IsOptional()
  pageSize?: number

  @IsNumber()
  @IsOptional()
  page?: number
}

export default GetManyProfilesArgs
