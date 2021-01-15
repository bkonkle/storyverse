import {Entity, Column, OneToMany} from 'typeorm'

import {UuidTable} from '../lib/data/Uuid'
import User from '../users/User.entity'
import Universe from '../universes/Universe.entity'

@Entity({name: 'profiles'})
export class Profile extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
  })
  email!: string

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  displayName?: string

  @Column({
    type: 'text',
    nullable: true,
  })
  picture?: string

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  content?: Record<string, unknown>

  @OneToMany(() => User, (user) => user.profile)
  users!: User[]

  @OneToMany(() => Universe, (universe) => universe.ownerProfile)
  universesOwned!: Universe[]
}

export default Profile
