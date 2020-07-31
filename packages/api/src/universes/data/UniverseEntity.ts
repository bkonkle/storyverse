import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm'
import {IsString, IsJSON, IsOptional, IsUUID, Max} from 'class-validator'

import Profile from '../../profiles/data/ProfileEntity'
import {UuidTable} from '../../utils/UuidTable'

export interface UniverseDescription {
  [key: string]: string
}

@Entity({name: 'universes'})
export class Universe extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    comment: 'A name for the Universe',
  })
  @IsString()
  @Max(300)
  name!: string

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: "Editor json content for the Universe''s description",
  })
  @IsJSON()
  @IsOptional()
  description?: UniverseDescription

  @Column({
    name: 'owned_by_profile_id',
    type: 'uuid',
    nullable: false,
    comment: ' The Profile that owns the Universe',
  })
  @IsUUID()
  ownedByProfileId!: string

  @ManyToOne((_type) => Profile, (profile) => profile.universesOwned)
  @JoinColumn({name: 'owned_by_profile_id'})
  ownedByProfile!: Profile
}

export default Universe
