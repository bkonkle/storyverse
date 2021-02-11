import clsx from 'clsx'
import React from 'react'

import Card from '../cards/Card'
import stories from './__fixtures__/stories.json'

export const getClasses = () => {
  return {
    title: clsx('text-2xl', 'font-bold', 'leading-tight', 'mb-4'),

    list: clsx('grid', 'grid-cols-3', 'grid-rows-3', 'gap-5'),
  }
}

export const Home = () => {
  const classes = getClasses()

  return (
    <div>
      <h2 className={classes.title}>Latest Stories</h2>
      <dl className={classes.list}>
        {stories &&
          stories.map((story) => (
            <Card
              image={story.image}
              title={story.name}
              summary={story.summary}
            />
          ))}
      </dl>
    </div>
  )
}

export default Home
