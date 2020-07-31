import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import {IsUUID, IsDateString} from 'class-validator'
import {ObjectType, Field, ID} from '@nestjs/graphql'

@ObjectType()
export abstract class UuidTable {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @IsUUID()
  id!: string

  @CreateDateColumn({name: 'created_at'})
  @Field()
  @IsDateString()
  createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  @Field()
  @IsDateString()
  updatedAt!: Date
}
