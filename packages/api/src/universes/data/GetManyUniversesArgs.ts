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
  QueryGetManyUniversesArgs,
  UniverseCondition,
  UniversesOrderBy,
} from '../../Schema'

export class UniverseConditionInput implements UniverseCondition {
  @IsUUID()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  name?: string

  @IsObject()
  @IsOptional()
  description?: Record<string, unknown>

  @IsUUID()
  @IsOptional()
  ownedByProfileId?: string

  @IsDate()
  @IsOptional()
  createdAt?: Date

  @IsDate()
  @IsOptional()
  updatedAt?: Date
}

export class GetManyUniversesArgs implements QueryGetManyUniversesArgs {
  @Type(() => UniverseConditionInput)
  @IsOptional()
  where?: UniverseConditionInput

  @IsArray()
  @IsEnum(Object.values(UniversesOrderBy))
  @IsOptional()
  orderBy?: UniversesOrderBy[]

  @IsNumber()
  @IsOptional()
  pageSize?: number

  @IsNumber()
  @IsOptional()
  page?: number
}

export default GetManyUniversesArgs
