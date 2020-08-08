import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm'

import Profile from '../profiles/Profile.entity'
import {UuidTable} from '../utils/Uuid'

@Entity({name: 'universes'})
export class Universe extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    comment: 'A name for the Universe',
  })
  name!: string

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: "Editor json content for the Universe''s description",
  })
  description?: Record<string, unknown>

  @Column({
    name: 'owned_by_profile_id',
    type: 'uuid',
    nullable: false,
    comment: ' The Profile that owns the Universe',
  })
  ownedByProfileId!: string

  @ManyToOne(() => Profile, (profile) => profile.universesOwned)
  @JoinColumn({name: 'owned_by_profile_id'})
  ownedByProfile!: Profile
}

export default Universe
