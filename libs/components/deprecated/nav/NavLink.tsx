import React from 'react'
import clsx from 'clsx'

import Link, {LinkProps} from './Link'

export interface NavLinkProps extends LinkProps {
  current?: boolean
  slide?: boolean
  profile?: boolean
  dropdown?: boolean
  external?: boolean
}

export const NavLink = (props: NavLinkProps) => {
  const {
    children,
    href,
    profile,
    dropdown,
    slide,
    current,
    external,
    className,
    ...rest
  } = props

  const classes = clsx(
    profile
      ? [
          'block',
          'py-2',
          dropdown
            ? ['px-4', 'text-sm', 'text-gray-700', 'hover:bg-gray-100']
            : [
                'px-3',
                'rounded-md',
                'text-base',
                'font-medium',
                'text-teal-800',
                'hover:bg-teal-200',
              ],
        ]
      : [
          'px-3',
          'py-2',
          'rounded-md',
          'font-medium',
          slide ? ['block', 'text-base'] : ['text-sm'],
          current
            ? ['bg-teal-400', 'text-white']
            : ['text-teal-800', 'hover:bg-teal-200'],
        ],
    href || 'cursor-pointer',
    className
  )

  return (
    <Link href={href} external={external} className={classes} {...rest}>
      {children}
    </Link>
  )
}

export default NavLink