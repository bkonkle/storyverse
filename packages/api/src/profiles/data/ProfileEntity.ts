import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm'
import {IsString, IsJSON, IsOptional, IsUUID, Max} from 'class-validator'

import User from '../../users/data/UserEntity'
import Universe from '../../universes/data/UniverseEntity'
import {UuidTable} from '../../utils/UuidTable'

export interface ProfileContent {
  [key: string]: string
}

@Entity({name: 'profiles'})
export class Profile extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    comment: 'An email address',
  })
  @IsString()
  @Max(300)
  email!: string

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: 'A display name',
  })
  @IsString()
  @Max(300)
  @IsOptional()
  displayName?: string

  @Column({
    type: 'text',
    nullable: true,
    comment: 'A Profile photo',
  })
  @IsString()
  @IsOptional()
  picture?: string

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Editor json content for the Profile body',
  })
  @IsJSON()
  @IsOptional()
  content?: ProfileContent

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: "The User''s city",
  })
  @IsString()
  @Max(300)
  @IsOptional()
  city?: string

  @Column({
    name: 'state_province',
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: "The User''s city",
  })
  @IsString()
  @Max(300)
  @IsOptional()
  stateProvince?: string

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
    comment: 'The User that created the Profile',
  })
  @IsUUID()
  userId!: string

  @ManyToOne((_type) => User, (user) => user.profiles)
  @JoinColumn({name: 'user_id'})
  user!: User

  @OneToMany((_type) => Universe, (universe) => universe.ownedByProfile)
  universesOwned!: Universe[]
}

export default Profile
