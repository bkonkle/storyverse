import React from 'react'
import clsx from 'clsx'

export const getClasses = () => {
  return {
    container: clsx('ml-3'),

    name: clsx('text-base', 'font-medium', 'leading-none', 'text-teal-800'),

    email: clsx('text-sm', 'font-medium', 'leading-none', 'text-teal-600'),
  }
}

export const Nameplate = () => {
  const classes = getClasses()

  return (
    <div className={classes.container}>
      <div className={classes.name}>Tom Cook</div>
      <div className={classes.email}>tom@example.com</div>
    </div>
  )
}

export default Nameplate
