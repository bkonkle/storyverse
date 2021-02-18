import clsx from 'clsx'
import React from 'react'

import {Controls} from '../Styles'

export interface NotificationsProps {
  slide?: boolean
  active?: boolean
}

export const getClasses = (props: NotificationsProps) => {
  const {active, slide} = props

  return {
    button: clsx(
      'p-1',
      'rounded-full',
      Controls.button({active}),
      slide && ['ml-auto', 'flex-shrink-0']
    ),
  }
}

export const Notifications = (props: NotificationsProps) => {
  const classes = getClasses(props)

  return (
    <button className={classes.button}>
      <span className="sr-only">View notifications</span>
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    </button>
  )
}

export default Notifications
