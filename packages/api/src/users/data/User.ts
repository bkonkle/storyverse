import {Entity, Column, OneToMany} from 'typeorm'
import {IsString, IsBoolean, Max} from 'class-validator'

import Profile from '../../profiles/data/Profile'
import {UuidTable} from '../../utils/Uuid'

@Entity({name: 'users'})
export class User extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    unique: true,
    nullable: false,
    comment: "The User''s login id - usually their email address.",
  })
  @IsString()
  @Max(300)
  username!: string

  @Column({
    name: 'is_active',
    default: true,
    comment: 'If false, the User is suspended.',
  })
  @IsBoolean()
  isActive!: boolean

  @OneToMany(() => Profile, (profile) => profile.user)
  profiles!: Profile[]
}

export default User
