import clsx from 'clsx'
import React from 'react'
import {Story} from '../../data/Schema'

import Card from '../cards/Card'
import * as Fixtures from '../../test/Fixtures'

export interface HomeProps {
  stories: Story[]
}

const defaultProps: HomeProps = {
  stories: Fixtures.stories,
}

export const getClasses = () => {
  return {
    title: clsx('text-2xl', 'font-bold', 'leading-tight', 'mb-4'),

    list: clsx('grid', 'grid-cols-3', 'grid-rows-3', 'gap-5'),
  }
}

export const Home = (props: HomeProps) => {
  const {stories} = props
  const classes = getClasses()

  return (
    <div>
      <h2 className={classes.title}>Latest Stories</h2>
      <dl className={classes.list}>
        {stories &&
          stories.map((story) => (
            <Card
              key={story.id}
              image={story.picture}
              title={story.name}
              summary={story.summary?.text}
            />
          ))}
      </dl>
    </div>
  )
}

Home.defaultProps = defaultProps

export default Home
