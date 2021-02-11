import React, {ReactNode} from 'react'
import clsx from 'clsx'
import Link from 'next/link'

export interface NavProfileLinkProps {
  href: string
  dropdown?: boolean
  children?: ReactNode
}

export const getClasses = (props: NavProfileLinkProps) => {
  const {dropdown} = props

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

export const NavProfileLink = (props: NavProfileLinkProps) => {
  const classes = getClasses(props)
  const {href, children} = props

  return (
    <Link href={href}>
      <a className={classes.link}>{children}</a>
    </Link>
  )
}

export default NavProfileLink
