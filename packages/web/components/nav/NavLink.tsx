import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface NavLinkProps {
  href: string
  current?: boolean
  slide?: boolean
  children?: ReactNode
}

export const getClasses = (props: NavLinkProps) => {
  const {current, slide} = props

  return {
    link: clsx(
      'px-3',
      'py-2',
      'rounded-md',
      'font-medium',
      slide ? ['block', 'text-base'] : ['text-sm'],
      current
        ? ['bg-gray-900', 'text-white']
        : ['text-gray-300', 'hover:bg-gray-700', 'hover:text-white']
    ),
  }
}

export const NavLink = (props: NavLinkProps) => {
  const classes = getClasses(props)
  const {href, children} = props

  return (
    <a href={href} className={classes.link}>
      {children}
    </a>
  )
}

export default NavLink
