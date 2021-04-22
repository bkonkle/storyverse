import React from 'react'

import {Universe} from '@storyverse/graphql/Schema'

import * as Fixtures from '../../test/Fixtures'
import CardList from '../cards/CardList'
import Card from '../cards/Card'

export interface UniversesProps {
  universes: Universe[]
}

const defaultProps: UniversesProps = {
  universes: Fixtures.universes,
}

export const Universes = (props: UniversesProps) => {
  const {universes} = props

  return (
    <CardList title="Featured Universes">
      {universes &&
        universes.map((universe) => (
          <Card
            key={universe.id}
            image={universe.picture}
            title={universe.name}
            summary={universe.description?.text}
          />
        ))}
    </CardList>
  )
}

Universes.defaultProps = defaultProps

export default Universes
