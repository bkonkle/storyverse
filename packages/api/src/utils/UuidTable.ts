import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import {IsUUID, IsOptional, IsDateString} from 'class-validator'

export abstract class UuidTable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id!: string

  @CreateDateColumn({name: 'created_at'})
  @IsDateString()
  @IsOptional()
  public createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  @IsDateString()
  @IsOptional()
  public updatedAt!: Date
}
