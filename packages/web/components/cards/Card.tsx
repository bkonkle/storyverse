import React from 'react'
import clsx from 'clsx'

export interface CardProps {
  image?: string | null
  title: string
  summary?: string
}

export const getClasses = (_props: CardProps) => {
  return {
    container: clsx('rounded-t-lg', 'bg-white'),

    image: clsx('rounded-t-lg', 'bg-cover', 'h-48'),

    content: clsx('mb-4', 'p-5'),

    title: clsx('text-lg', 'leading-6', 'font-medium', 'text-gray-900'),

    detail: clsx('mt-2', 'text-base', 'text-gray-500'),
  }
}

export const Card = (props: CardProps) => {
  const {image, title, summary} = props
  const classes = getClasses(props)

  return (
    <div className={classes.container}>
      <div
        className={classes.image}
        style={{backgroundImage: `url(${image})`}}
      />
      <div className={classes.content}>
        <dt className={classes.title}>{title}</dt>
        <dd className={classes.detail}>{summary}</dd>
      </div>
    </div>
  )
}

Card.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
}

export default Card
