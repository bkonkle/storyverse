import React from 'react'

import * as Fixtures from '../../test/Fixtures'
import {Story} from '@storyverse/shared/data/Schema'
import CardList from '../cards/CardList'
import Card from '../cards/Card'

export interface StoriesProps {
  stories: Story[]
}

const defaultProps: StoriesProps = {
  stories: Fixtures.stories,
}

export const Stories = (props: StoriesProps) => {
  const {stories} = props

  return (
    <CardList title="Featured Stories">
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

Stories.defaultProps = defaultProps

export default Stories
