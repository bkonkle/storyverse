import React from 'react'
import clsx from 'clsx'

export interface CardProps {
  image?: string | null
  title: string
  summary?: string
}

export const Card = (props: CardProps) => {
  const {image, title, summary} = props

  return (
    <div className={clsx('rounded-t-lg', 'bg-white')}>
      <div
        className={clsx('rounded-t-lg', 'bg-cover', 'h-48')}
        style={{backgroundImage: `url(${image})`}}
      />
      <div className={clsx('mb-4', 'p-5')}>
        <dt
          className={clsx(
            'text-lg',
            'leading-6',
            'font-medium',
            'text-gray-900'
          )}
        >
          {title}
        </dt>
        <dd className={clsx('mt-2', 'text-base', 'text-gray-500')}>
          {summary}
        </dd>
      </div>
    </div>
  )
}

Card.defaultProps = {
  image:
    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80',
}

export default Card
