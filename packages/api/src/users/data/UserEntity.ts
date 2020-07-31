import {Entity, Column} from 'typeorm'
import {IsString, IsBoolean} from 'class-validator'

import {UuidTable} from '../../utils/UuidTable'

@Entity({name: 'users'})
export class User extends UuidTable {
  @Column({
    unique: true,
    nullable: false,
    comment: "The User''s login id - usually their email address.",
    type: 'varchar',
  })
  @IsString()
  username!: string

  @Column({comment: 'If false, the User is suspended.', name: 'is_active'})
  @IsBoolean()
  isActive!: boolean
}

export default User
