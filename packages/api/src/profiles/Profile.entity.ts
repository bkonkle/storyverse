import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from 'typeorm'

import User from '../users/User.entity'
import Universe from '../universes/Universe.entity'
import {UuidTable} from '../utils/Uuid'

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

  @Column({
    name: 'user_id',
    type: 'uuid',
    nullable: false,
  })
  userId!: string

  @ManyToOne(() => User, (user) => user.profiles)
  @JoinColumn({name: 'user_id'})
  user!: User

  @OneToMany(() => Universe, (universe) => universe.ownedByProfile)
  universesOwned!: Universe[]
}

export default Profile
