import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm'

import Profile from '../profiles/Profile.entity'
import {UuidTable} from '../lib/data/Uuid'

export const TABLE_NAME = 'universes'

@Entity({name: TABLE_NAME})
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
    name: 'owner_profile_id',
    type: 'uuid',
    nullable: false,
    comment: ' The Profile that owns the Universe',
  })
  ownerProfileId!: string

  @ManyToOne(() => Profile, (profile) => profile.universesOwned, {eager: true})
  @JoinColumn({name: 'owner_profile_id'})
  ownerProfile!: Profile
}

export default Universe
