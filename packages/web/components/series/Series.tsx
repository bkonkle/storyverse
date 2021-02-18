import clsx from 'clsx'
import React from 'react'

import {Section} from '../Styles'

export const getClasses = () => {
  return {
    title: clsx(Section.title),
  }
}

export const Series = () => {
  const classes = getClasses()

  return (
    <div>
      <h2 className={classes.title}>Featured Series</h2>
    </div>
  )
}

export default Series
