import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm'

import Universe from '../universes/Universe.entity'
import {UuidTable} from '../lib/data/Uuid'

export const TABLE_NAME = 'series'

@Entity({name: TABLE_NAME})
export class Series extends UuidTable {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    comment: 'A name for the Series',
  })
  name!: string

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Editor json content for the Series description',
  })
  description?: Record<string, unknown>

  @Column({
    name: 'universe_id',
    type: 'uuid',
    nullable: false,
    comment: 'The Universe that the Series belongs to',
  })
  universeId!: string

  @ManyToOne(() => Universe, (universe) => universe.series)
  @JoinColumn({name: 'universe_id'})
  universe!: Universe
}

export default Series
