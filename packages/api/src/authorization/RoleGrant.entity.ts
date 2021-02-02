import {Entity, Column} from 'typeorm'

import {UuidTable} from '../lib/data/Uuid'

@Entity({name: 'role_grants'})
export class RoleGrant extends UuidTable {
  @Column({
    name: 'role_key',
    type: 'varchar',
    length: 300,
    nullable: false,
  })
  roleKey!: string

  @Column({
    name: 'profile_id',
    type: 'uuid',
    nullable: false,
  })
  profileId!: string

  @Column({
    name: 'subject_table',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  subjectTable?: string

  @Column({
    name: 'subject_id',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  subjectId?: string
}

export default RoleGrant
