import React from 'react'

import * as Fixtures from '../../test/Fixtures'
import {Story} from '../../data/Schema'
import CardList from '../cards/CardList'
import Card from '../cards/Card'

export interface HomeProps {
  stories: Story[]
}

const defaultProps: HomeProps = {
  stories: Fixtures.stories,
}

export const Home = (props: HomeProps) => {
  const {stories} = props

  return (
    <CardList title="Latest Stories">
      {stories &&
        stories.map((story) => (
          <Card
            key={story.id}
            image={story.picture}
            title={story.name}
            summary={story.summary?.text}
          />
        ))}
    </CardList>
  )
}

Home.defaultProps = defaultProps

export default Home
