import {Type} from 'class-transformer'
import {
  IsUUID,
  IsOptional,
  IsString,
  IsBoolean,
  IsDate,
  IsArray,
  IsEnum,
  IsNumber,
} from 'class-validator'

import {QueryGetManyUsersArgs, UserCondition, UsersOrderBy} from '../../Schema'

export class UserConditionInput implements UserCondition {
  @IsUUID()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  username?: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsDate()
  @IsOptional()
  createdAt?: Date

  @IsDate()
  @IsOptional()
  updatedAt?: Date
}

export class GetManyUsersArgs implements QueryGetManyUsersArgs {
  @Type(() => UserConditionInput)
  @IsOptional()
  where?: UserConditionInput

  @IsArray()
  @IsEnum(Object.values(UsersOrderBy))
  @IsOptional()
  orderBy?: UsersOrderBy[]

  @IsNumber()
  @IsOptional()
  pageSize?: number

  @IsNumber()
  @IsOptional()
  page?: number
}

export default GetManyUsersArgs
