import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface CardListProps {
  children: ReactNode
  title?: string
}

export const getClasses = () => {
  return {
    title: clsx('text-2xl', 'font-bold', 'leading-tight', 'mb-4'),

    list: clsx('grid', 'grid-cols-3', 'grid-rows-3', 'gap-5'),
  }
}

export const CardList = (props: CardListProps) => {
  const {children, title} = props
  const classes = getClasses()

  return (
    <>
      {title && <h2 className={classes.title}>{title}</h2>}
      <dl className={classes.list}>{children}</dl>
    </>
  )
}

export default CardList
