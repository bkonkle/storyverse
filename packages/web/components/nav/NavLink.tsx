import React, {ReactNode} from 'react'
import clsx from 'clsx'

import Link from './Link'

export interface NavLinkProps {
  href: string
  current?: boolean
  slide?: boolean
  profile?: boolean
  dropdown?: boolean
  external?: boolean
  children?: ReactNode
}

export const getClasses = (props: NavLinkProps) => {
  const {current, slide, profile, dropdown} = props

  if (profile) {
    return {
      link: clsx(
        'block',
        'py-2',
        dropdown
          ? ['px-4', 'text-sm', 'text-gray-700', 'hover:bg-gray-100']
          : [
              'px-3',
              'rounded-md',
              'text-base',
              'font-medium',
              'text-gray-400',
              'hover:text-white',
              'hover:bg-gray-700',
            ]
      ),
    }
  }

  return {
    link: clsx(
      'px-3',
      'py-2',
      'rounded-md',
      'font-medium',
      slide ? ['block', 'text-base'] : ['text-sm'],
      current
        ? ['bg-teal-400', 'text-white']
        : ['text-teal-800', 'hover:bg-teal-200']
    ),
  }
}

export const NavLink = (props: NavLinkProps) => {
  const {href, children, external} = props
  const classes = getClasses(props)

  return (
    <Link href={href} external={external} className={classes.link}>
      {children}
    </Link>
  )
}

export default NavLink
