import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import {IsString, IsJSON, IsOptional, IsUUID, Max} from 'class-validator'
import {Field, ObjectType} from '@nestjs/graphql'

import User from '../../users/data/User'
import Universe from '../../universes/data/Universe'
import {UuidTable} from '../../utils/Uuid'
import ProfileContent from './ProfileContent'

@Entity({name: 'profiles'})
@ObjectType({description: 'A User Profile'})
export class Profile extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
  })
  @Field({description: 'An email address'})
  @IsString()
  @Max(300)
  email!: string

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  @Field({description: 'A display name'})
  @IsString()
  @Max(300)
  @IsOptional()
  displayName?: string

  @Column({
    type: 'text',
    nullable: true,
  })
  @Field({description: 'A Profile photo'})
  @IsString()
  @IsOptional()
  picture?: string

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  @Field({description: 'Editor json content for the Profile body'})
  @IsJSON()
  @IsOptional()
  content?: ProfileContent

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  @Field({description: "The User''s city"})
  @IsString()
  @Max(300)
  @IsOptional()
  city?: string

  @Column({
    name: 'state_province',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  @Field({description: "The User''s state or province"})
  @IsString()
  @Max(300)
  @IsOptional()
  stateProvince?: string

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  @Field({description: 'The User that created the Profile'})
  @IsUUID()
  userId!: string

  @ManyToOne(() => User, (user) => user.profiles)
  @JoinColumn({name: 'user_id'})
  user!: User

  @OneToMany(() => Universe, (universe) => universe.ownedByProfile)
  universesOwned!: Universe[]
}

export default Profile
