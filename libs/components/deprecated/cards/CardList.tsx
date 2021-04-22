import {ReactNode} from 'react'
import clsx from 'clsx'

export interface CardListProps {
  children: ReactNode
  title?: string
}

export const CardList = (props: CardListProps) => {
  const {children, title} = props

  return (
    <>
      {title && (
        <h2 className={clsx('text-2xl', 'font-bold', 'leading-tight', 'mb-4')}>
          {title}
        </h2>
      )}
      <dl className={clsx('grid', 'grid-cols-3', 'grid-rows-3', 'gap-5')}>
        {children}
      </dl>
    </>
  )
}

export default CardList
