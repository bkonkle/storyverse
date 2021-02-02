import {Entity, Column, OneToOne, JoinColumn, OneToMany} from 'typeorm'

import User from '../users/User.entity'
import Universe from '../universes/Universe.entity'
import {UuidTable} from '../lib/data/Uuid'

export const TABLE_NAME = 'profiles'

@Entity({name: TABLE_NAME})
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

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId!: string

  @OneToOne(() => User, (user) => user.profiles, {eager: true})
  @JoinColumn({name: 'user_id'})
  user!: User

  @OneToMany(() => Universe, (universe) => universe.ownerProfile)
  universesOwned!: Universe[]
}

export default Profile
