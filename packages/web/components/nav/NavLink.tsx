import React, {ReactNode} from 'react'
import clsx from 'clsx'

export interface NavLinkProps {
  href: string
  current?: boolean
  mobile?: boolean
  children?: ReactNode
}

export const getClasses = (props: NavLinkProps) => {
  const {current, mobile} = props

  return {
    link: clsx(
      'px-3',
      'py-2',
      'rounded-md',
      'font-medium',
      mobile ? ['block', 'text-base'] : ['text-sm'],
      current
        ? ['bg-gray-900', 'text-white']
        : ['text-gray-300', 'hover:bg-gray-700', 'hover:text-white']
    ),
  }
}

export const NavLink = (props: NavLinkProps) => {
  const classes = getClasses(props)
  const {children} = props

  return (
    <a href="#" className={classes.link}>
      {children}
    </a>
  )
}

export default NavLink
