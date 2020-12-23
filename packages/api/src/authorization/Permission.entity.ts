import {Entity, Column, ManyToMany} from 'typeorm'

import {UuidTable} from '../utils/Uuid'
import Role from './Role.entity'

@Entity({name: 'permissions'})
export class Permission extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    unique: true,
    nullable: false,
    comment: 'The unique key for the Permission.',
  })
  key!: string

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    comment: 'A display name for the Permission.',
  })
  name!: string

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: "Editor json content for the Permission''s description",
  })
  description?: Record<string, unknown>

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[]
}

export default Permission
