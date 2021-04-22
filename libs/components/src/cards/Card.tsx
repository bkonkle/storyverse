import {ReactNode} from 'react'
import clsx from 'clsx'

export interface CardProps {
  heading?: ReactNode
  children?: ReactNode
}

export const Card = ({heading, children}: CardProps) => {
  return (
    <div
      className={clsx(
        'relative',
        'flex',
        'flex-col',
        'min-w-0',
        'break-words',
        'w-full',
        'mb-6',
        'shadow-lg',
        'rounded-lg',
        'bg-blueGray-100',
        'border-0'
      )}
    >
      {heading}
      <div className="flex-auto px-4 lg:px-10 py-10 pt-0">{children}</div>
    </div>
  )
}

export default Card
