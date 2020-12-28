import {Entity, Column, OneToOne} from 'typeorm'

import Profile from '../profiles/Profile.entity'
import {UuidTable} from '../lib/data/Uuid'

@Entity({name: 'users'})
export class User extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    unique: true,
    nullable: false,
    comment: "The User''s login id - usually their email address.",
  })
  username!: string

  @Column({
    name: 'is_active',
    default: true,
    comment: 'If false, the User is suspended.',
  })
  isActive!: boolean

  @OneToOne(() => Profile, (profile) => profile.user)
  profiles!: Profile[]
}

export default User
