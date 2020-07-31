import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import {IsUUID, IsDateString} from 'class-validator'

export abstract class UuidTable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id!: string

  @CreateDateColumn({name: 'created_at'})
  @IsDateString()
  public createdAt!: Date

  @UpdateDateColumn({name: 'updated_at'})
  @IsDateString()
  public updatedAt!: Date
}
