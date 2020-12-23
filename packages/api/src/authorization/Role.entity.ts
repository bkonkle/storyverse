import {Entity, Column, ManyToMany, JoinTable} from 'typeorm'

import {UuidTable} from '../utils/Uuid'
import Permission from './Permission.entity'

@Entity({name: 'roles'})
export class Role extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    unique: true,
    nullable: false,
    comment: 'The unique key for the Role.',
  })
  key!: string

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    comment: 'A display name for the Role.',
  })
  name!: string

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: "Editor json content for the Role''s description",
  })
  description?: Record<string, unknown>

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({name: 'role_permissions'})
  permissions!: Permission[]
}

export default Role
